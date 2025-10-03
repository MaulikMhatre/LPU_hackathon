from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from models.user import User
from models.activity import Activity
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data.get('email')).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 409
    
    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        name=data.get('name'),
        email=data.get('email'),
        password_hash=generate_password_hash(data.get('password')),
        avatar=data.get('avatar')
    )
    
    # Add user to database
    db.session.add(new_user)
    
    # Log activity
    activity = Activity(
        user_id=new_user.id,
        activity_type='account_created',
        description=f'Account created for {new_user.name}'
    )
    db.session.add(activity)
    
    db.session.commit()
    
    return jsonify({
        'message': 'User registered successfully',
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data.get('email')).first()
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Log activity
    activity = Activity(
        user_id=user.id,
        activity_type='login',
        description=f'{user.name} logged in'
    )
    db.session.add(activity)
    db.session.commit()
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200