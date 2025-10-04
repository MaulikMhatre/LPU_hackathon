from datetime import datetime
from app import db

class PersonalizedTutor(db.Model):
    __tablename__ = 'personalized_tutors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    performance_level = db.Column(db.String(50), nullable=False)  # 'low', 'medium', 'high'
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    quiz_data = db.Column(db.Text, nullable=True)  # JSON string containing quiz questions and answers
    completed = db.Column(db.Boolean, default=False)
    score = db.Column(db.Float, nullable=True)  # Student's score on this quiz/task
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subject': self.subject,
            'performance_level': self.performance_level,
            'title': self.title,
            'content': self.content,
            'quiz_data': self.quiz_data,
            'completed': self.completed,
            'score': self.score,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PerformanceHistory(db.Model):
    __tablename__ = 'performance_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    quiz_id = db.Column(db.Integer, nullable=True)  # Can be null if it's an external exam
    score = db.Column(db.Float, nullable=False)
    max_score = db.Column(db.Float, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    date_taken = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subject': self.subject,
            'quiz_id': self.quiz_id,
            'score': self.score,
            'max_score': self.max_score,
            'percentage': self.percentage,
            'date_taken': self.date_taken.isoformat() if self.date_taken else None
        }