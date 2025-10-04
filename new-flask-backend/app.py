from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

# Initialize extensions
db = SQLAlchemy()

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    CORS(app)
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartedtech.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions with app
    db.init_app(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.dashboard import dashboard_bp
    from routes.assignments import assignments_bp
    from routes.boosters import boosters_bp
    from routes.adaptive_practice import adaptive_practice_bp
    from routes.personalized_tutor import personalized_tutor_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(assignments_bp, url_prefix='/api/assignments')
    app.register_blueprint(boosters_bp, url_prefix='/api/boosters')
    app.register_blueprint(adaptive_practice_bp, url_prefix='')
    app.register_blueprint(personalized_tutor_bp, url_prefix='')
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'Smart EdTech API is running'})
    
    return app

# Create the application instance
app = create_app()

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)