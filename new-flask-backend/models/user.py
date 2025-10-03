from datetime import datetime
import uuid
from app import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    avatar = db.Column(db.String(200), nullable=True)
    level = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    assignments = db.relationship('Assignment', backref='user', lazy=True)
    activities = db.relationship('Activity', backref='user', lazy=True)
    performances = db.relationship('Performance', backref='user', lazy=True)
    
    def __repr__(self):
        return f'<User {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'avatar': self.avatar,
            'level': self.level,
            'created_at': self.created_at.isoformat()
        }