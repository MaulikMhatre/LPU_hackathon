from datetime import datetime
import uuid
from app import db

class PerformanceBooster(db.Model):
    __tablename__ = 'performance_boosters'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    assignment_id = db.Column(db.String(36), db.ForeignKey('assignments.id'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    assignment_title = db.Column(db.String(200), nullable=False)
    grade = db.Column(db.Float, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    tier = db.Column(db.Integer, nullable=False)  # 1-4 based on grade range
    diagnostic_summary = db.Column(db.Text, nullable=True)
    strategies = db.Column(db.Text, nullable=True)
    resources = db.Column(db.Text, nullable=True)
    assessment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<PerformanceBooster {self.assignment_title}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'assignment_id': self.assignment_id,
            'subject': self.subject,
            'assignment_title': self.assignment_title,
            'grade': self.grade,
            'feedback': self.feedback,
            'tier': self.tier,
            'diagnostic_summary': self.diagnostic_summary,
            'strategies': self.strategies,
            'resources': self.resources,
            'assessment': self.assessment,
            'created_at': self.created_at.isoformat()
        }