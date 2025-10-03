from flask import Blueprint, jsonify
from models.user import User
from models.assignment import Assignment
from models.activity import Activity
from models.performance import Performance

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/user/<user_id>', methods=['GET'])
def get_dashboard(user_id):
    # Get user data
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get pending assignments
    pending_assignments = Assignment.query.filter_by(
        user_id=user_id, 
        status='pending'
    ).order_by(Assignment.due_date.asc()).limit(5).all()
    
    # Get recent activities
    recent_activities = Activity.query.filter_by(
        user_id=user_id
    ).order_by(Activity.created_at.desc()).limit(10).all()
    
    # Get performance data
    performance_data = Performance.query.filter_by(
        user_id=user_id
    ).order_by(Performance.date.desc()).limit(5).all()
    
    # Prepare response
    dashboard_data = {
        'user': user.to_dict(),
        'pending_assignments': [assignment.to_dict() for assignment in pending_assignments],
        'recent_activities': [activity.to_dict() for activity in recent_activities],
        'performance': [performance.to_dict() for performance in performance_data]
    }
    
    return jsonify(dashboard_data), 200