from flask import Blueprint, request, jsonify
from models.assignment import Assignment
from models.activity import Activity
from app import db

assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/<user_id>', methods=['GET'])
def get_assignments(user_id):
    status = request.args.get('status', 'all')
    
    # Query assignments
    query = Assignment.query.filter_by(user_id=user_id)
    
    # Filter by status if provided
    if status != 'all':
        query = query.filter_by(status=status)
    
    # Get assignments
    assignments = query.order_by(Assignment.due_date.asc()).all()
    
    return jsonify([assignment.to_dict() for assignment in assignments]), 200

@assignments_bp.route('/<user_id>', methods=['POST'])
def create_assignment(user_id):
    data = request.get_json()
    
    # Check if required fields are present
    if not data or not data.get('title') or not data.get('subject') or not data.get('due_date'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new assignment
    new_assignment = Assignment(
        user_id=user_id,
        title=data.get('title'),
        subject=data.get('subject'),
        description=data.get('description'),
        due_date=data.get('due_date')
    )
    
    # Add assignment to database
    db.session.add(new_assignment)
    
    # Log activity
    activity = Activity(
        user_id=user_id,
        activity_type='assignment_created',
        description=f'Assignment created: {new_assignment.title}'
    )
    db.session.add(activity)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Assignment created successfully',
        'assignment': new_assignment.to_dict()
    }), 201

@assignments_bp.route('/<user_id>/<assignment_id>', methods=['PUT'])
def update_assignment(user_id, assignment_id):
    data = request.get_json()
    
    # Find assignment
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=user_id).first()
    if not assignment:
        return jsonify({'error': 'Assignment not found'}), 404
    
    # Update assignment fields
    if data.get('title'):
        assignment.title = data.get('title')
    if data.get('subject'):
        assignment.subject = data.get('subject')
    if data.get('description'):
        assignment.description = data.get('description')
    if data.get('due_date'):
        assignment.due_date = data.get('due_date')
    if data.get('status'):
        assignment.status = data.get('status')
    if data.get('score'):
        assignment.score = data.get('score')
    
    # Log activity
    activity = Activity(
        user_id=user_id,
        activity_type='assignment_updated',
        description=f'Assignment updated: {assignment.title}'
    )
    db.session.add(activity)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Assignment updated successfully',
        'assignment': assignment.to_dict()
    }), 200