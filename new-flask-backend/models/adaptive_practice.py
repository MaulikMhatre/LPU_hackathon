from datetime import datetime
from app import db

class AdaptivePractice(db.Model):
    __tablename__ = 'adaptive_practices'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    performance_level = db.Column(db.String(50), nullable=False)  # 'remedial', 'standard', 'advanced'
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    resources = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subject': self.subject,
            'performance_level': self.performance_level,
            'title': self.title,
            'description': self.description,
            'content': self.content,
            'resources': self.resources,
            'completed': self.completed,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }