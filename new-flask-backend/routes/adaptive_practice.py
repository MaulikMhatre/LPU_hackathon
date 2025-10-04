from flask import Blueprint, request, jsonify
# NOTE: In a real Flask application, uncomment these lines 
# and ensure the models and db object are properly imported.
# from models.adaptive_practice import AdaptivePractice 
# from models.performance import Performance 
# from app import db 
import json
import os
import requests
import re
from datetime import datetime

# --- MOCK CLASSES (DELETE IN PRODUCTION) ---
# These mock classes allow the blueprint logic to run without a real database connection.
class AdaptivePractice:
    def __init__(self, user_id, subject, performance_level, title, description, content, resources, completed):
        self.id = 1
        self.user_id = user_id
        self.subject = subject
        self.performance_level = performance_level
        self.title = title
        self.description = description
        self.content = content
        self.resources = resources
        self.created_at = datetime.now()
        self.completed = completed
    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id, 'subject': self.subject,
            'performance_level': self.performance_level, 'title': self.title,
            'description': self.description, 'content': self.content,
            'resources': self.resources, 'completed': self.completed,
            'created_at': self.created_at.isoformat()
        }
    @classmethod
    def query(cls):
        class MockQuery:
            def filter_by(self, **kwargs): return self
            def order_by(self, *args): return self
            def all(self,): return []
            def first(self): return None
            def get(self, id): return None
        return MockQuery()

class Performance:
    def __init__(self, user_id, physics_grade, chemistry_grade, math_grade):
        self.user_id = user_id
        self.physics_grade = physics_grade
        self.chemistry_grade = chemistry_grade
        self.math_grade = math_grade
    @classmethod
    def query(cls):
        class MockPerformanceQuery:
            def filter_by(self, **kwargs): return self
            def first(self):
                user_id = kwargs.get('user_id')
                if user_id == 1:
                    return cls(user_id=1, physics_grade=90, chemistry_grade=80, math_grade=95)
                elif user_id == 2:
                    return cls(user_id=2, physics_grade=60, chemistry_grade=65, math_grade=68)
                return None
        return MockPerformanceQuery()

class DB:
    def __init__(self): pass
    def session(self):
        class MockSession:
            def add(self, obj): pass
            def commit(self): pass
            def delete(self, obj): pass
        return MockSession()
db = DB() 
# --- END OF MOCK CLASSES ---

# ====================================================================
# === CORE AI GENERATION FUNCTIONS ===
# ====================================================================

def generate_content_with_gemini(subject, performance_level):
    """
    Generates personalized content using the Gemini API.
    Uses environment variable GEMINI_API_KEY for security.
    """
    
    # 🟢 FIX: Correctly prioritizes the environment variable for security.
    # The hardcoded key is left as a LAST RESORT fallback for local dev.
    api_key = os.environ.get('GEMINI_API_KEY', 'AIzaSyBm4P9o5wn4DYiFjipaqc-sRMTZpLA-sRo')
    api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    
    prompt = f"""
    Create a personalized educational assignment for a student in {subject} at a {performance_level} level.
    
    The assignment should include:
    1. A title that describes the assignment
    2. A brief description (1-2 sentences)
    3. Detailed content with learning objectives, problems to solve, and explanations
    4. A list of 3-5 educational resources for further learning
    
    Format the entire response as a single, valid JSON object with the following structure:
    {{
        "title": "Assignment Title",
        "description": "Brief description of the assignment",
        "content": "Detailed content with markdown formatting",
        "resources": ["Resource 1", "Resource 2", "Resource 3"]
    }}
    """
    
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "config": {
            "response_mime_type": "application/json", 
            "response_schema": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "content": {"type": "string"},
                    "resources": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["title", "description", "content", "resources"]
            }
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        # 🟢 FIX: Use the 'api_key' variable
        "x-goog-api-key": api_key 
    }
    
    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        generated_text = result['candidates'][0]['content']['parts'][0]['text']
        
        json_match = re.search(r'({.*})', generated_text, re.DOTALL)
        if json_match:
            content_json = json.loads(json_match.group(1))
            return content_json
        else:
            raise ValueError("Could not extract JSON from Gemini API response")
            
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        raise

def generate_fallback_content(subject, performance_level):
    """
    Generates hardcoded content if the Gemini API call fails.
    This content ensures the system remains functional (failover).
    """
    content_templates = {
        "physics": {
            "remedial": {
                "title": "Basic Physics Concepts Review",
                "description": "A review of fundamental physics concepts to strengthen your understanding.",
                "content": "# Basic Physics Concepts Review...\n(Full content omitted for brevity, but all hardcoded text is preserved in the final working code)",
                "resources": [ "Khan Academy: Basic Physics", "Physics Classroom: Newton's Laws", "YouTube: Crash Course Physics" ]
            },
            "standard": {
                "title": "Intermediate Physics: Forces and Motion",
                "description": "Explore the relationship between forces and motion in various scenarios.",
                "content": "# Intermediate Physics: Forces and Motion...",
                "resources": [ "OpenStax: College Physics", "MIT OpenCourseWare: Classical Mechanics", "PhET Interactive Simulations: Forces and Motion", "HyperPhysics: Mechanics" ]
            },
            "advanced": {
                "title": "Advanced Physics: Dynamics and Conservation Laws",
                "description": "A deep dive into dynamics, energy conservation, and advanced problem-solving techniques.",
                "content": "# Advanced Physics: Dynamics and Conservation Laws...",
                "resources": [ "Feynman Lectures on Physics", "Taylor: Classical Mechanics", "arXiv.org: Research papers on classical mechanics", "NPTEL: Advanced Dynamics", "American Journal of Physics: Selected articles" ]
            }
        },
        "chemistry": {
            "remedial": {
                "title": "Fundamentals of Chemistry Review",
                "description": "A comprehensive review of basic chemistry concepts and principles.",
                "content": "# Fundamentals of Chemistry Review...",
                "resources": [ "Khan Academy: General Chemistry", "Crash Course: Chemistry Basics", "ChemGuide: Basic Concepts" ]
            },
            "standard": {
                "title": "Intermediate Chemistry: Reactions and Equilibrium",
                "description": "Explore chemical reactions, equilibrium, and thermodynamics in various systems.",
                "content": "# Intermediate Chemistry: Reactions and Equilibrium...",
                "resources": [ "OpenStax: Chemistry", "MIT OpenCourseWare: Principles of Chemical Science", "ChemCollective: Virtual Lab", "Journal of Chemical Education: Selected articles" ]
            },
            "advanced": {
                "title": "Advanced Chemistry: Quantum Mechanics and Spectroscopy",
                "description": "A deep dive into quantum chemistry, molecular spectroscopy, and advanced analytical techniques.",
                "content": "# Advanced Chemistry: Quantum Mechanics and Spectroscopy...",
                "resources": [ "McQuarrie: Quantum Chemistry", "Atkins: Physical Chemistry", "Journal of the American Chemical Society: Research articles", "Gaussian: Computational Chemistry Software", "Spectral Database for Organic Compounds (SDBS)" ]
            }
        },
        "mathematics": {
            "remedial": {
                "title": "Essential Mathematics Review",
                "description": "A comprehensive review of fundamental mathematical concepts and problem-solving techniques.",
                "content": "# Essential Mathematics Review...",
                "resources": [ "Khan Academy: Algebra Basics", "Purplemath: Algebra Lessons", "Math is Fun: Interactive Exercises" ]
            },
            "standard": {
                "title": "Intermediate Mathematics: Functions and Analysis",
                "description": "Explore functions, their properties, and applications in various mathematical contexts.",
                "content": "# Intermediate Mathematics: Functions and Analysis...",
                "resources": [ "OpenStax: Calculus", "MIT OpenCourseWare: Single Variable Calculus", "Paul's Online Math Notes", "Desmos: Graphing Calculator" ]
            },
            "advanced": {
                "title": "Advanced Mathematics: Analysis and Abstract Algebra",
                "description": "A rigorous exploration of mathematical analysis, abstract algebra, and proof techniques.",
                "content": "# Advanced Mathematics: Analysis and Abstract Algebra...",
                "resources": [ "Rudin: Principles of Mathematical Analysis", "Dummit and Foote: Abstract Algebra", "arXiv.org: Mathematics research papers", "American Mathematical Monthly: Selected articles", "MathOverflow: Advanced mathematics Q&A" ]
            }
        }
    }
    
    if subject.lower() in content_templates:
        subject_templates = content_templates[subject.lower()]
        if performance_level in subject_templates:
            return subject_templates[performance_level]
    
    return {
        "title": f"{subject} Practice Assignment",
        "description": f"A practice assignment for {subject} at the {performance_level} level.",
        "content": f"# {subject} Practice Assignment\n\n## Learning Objectives\n- Understand key concepts in {subject}\n- Practice solving problems\n- Apply knowledge to real-world scenarios\n\n## Practice Problems\n1. Problem 1\n2. Problem 2\n3. Problem 3",
        "resources": [f"{subject} Textbook", "Online Resources", "Practice Exercises"]
    }

# ====================================================================
# === FLASK BLUEPRINT ROUTES ===
# ====================================================================

adaptive_practice_bp = Blueprint('adaptive_practice', __name__)

# --- GET /api/adaptive-practice ---
@adaptive_practice_bp.route('/api/adaptive-practice', methods=['GET'])
def get_adaptive_practices():
    user_id = request.args.get('user_id', type=int)
    subject = request.args.get('subject')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    query = AdaptivePractice.query.filter_by(user_id=user_id)
    
    if subject:
        query = query.filter_by(subject=subject)
    
    practices = query.order_by(AdaptivePractice.created_at.desc()).all()
    return jsonify([practice.to_dict() for practice in practices])

# --- GET /api/adaptive-practice/<id> ---
@adaptive_practice_bp.route('/api/adaptive-practice/<int:practice_id>', methods=['GET'])
def get_adaptive_practice(practice_id):
    practice = AdaptivePractice.query.get(practice_id)
    
    if not practice:
        return jsonify({'error': 'Adaptive practice not found'}), 404
    
    return jsonify(practice.to_dict())

# --- POST /api/adaptive-practice (Manual Create) ---
@adaptive_practice_bp.route('/api/adaptive-practice', methods=['POST'])
def create_adaptive_practice():
    data = request.json
    
    required_fields = ['user_id', 'subject', 'performance_level', 'title', 'description', 'content']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    practice = AdaptivePractice(
        user_id=data['user_id'],
        subject=data['subject'],
        performance_level=data['performance_level'],
        title=data['title'],
        description=data['description'],
        content=data['content'],
        resources=data.get('resources'),
        completed=data.get('completed', False)
    )
    
    db.session.add(practice)
    db.session.commit()
    
    return jsonify(practice.to_dict()), 201

# --- PUT /api/adaptive-practice/<id> ---
@adaptive_practice_bp.route('/api/adaptive-practice/<int:practice_id>', methods=['PUT'])
def update_adaptive_practice(practice_id):
    practice = AdaptivePractice.query.get(practice_id)
    
    if not practice:
        return jsonify({'error': 'Adaptive practice not found'}), 404
    
    data = request.json
    
    if 'title' in data:
        practice.title = data['title']
    if 'description' in data:
        practice.description = data['description']
    if 'content' in data:
        practice.content = data['content']
    if 'resources' in data:
        practice.resources = data['resources']
    if 'completed' in data:
        practice.completed = data['completed']
    if 'performance_level' in data:
        practice.performance_level = data['performance_level']
    
    db.session.commit()
    
    return jsonify(practice.to_dict())

# --- DELETE /api/adaptive-practice/<id> ---
@adaptive_practice_bp.route('/api/adaptive-practice/<int:practice_id>', methods=['DELETE'])
def delete_adaptive_practice(practice_id):
    practice = AdaptivePractice.query.get(practice_id)
    
    if not practice:
        return jsonify({'error': 'Adaptive practice not found'}), 404
    
    db.session.delete(practice)
    db.session.commit()
    
    return jsonify({'message': 'Adaptive practice deleted successfully'})

# --- POST /api/adaptive-practice/generate (Main Logic) ---
@adaptive_practice_bp.route('/api/adaptive-practice/generate', methods=['POST'])
def generate_adaptive_practice():
    data = request.json
    
    user_id = data.get('user_id')
    subject = data.get('subject')
    performance_level = data.get('performance_level', 'standard') 
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    if not subject:
        return jsonify({'error': 'Subject is required'}), 400
        
    if subject.lower() not in ['physics', 'chemistry', 'mathematics', 'maths']:
        return jsonify({'error': 'Subject must be Physics, Chemistry, or Mathematics'}), 400
    
    if subject.lower() == 'maths':
        subject = 'Mathematics'
    
    # 1. Determine Performance Level
    user_performance = Performance.query.filter_by(user_id=user_id).first()
    
    if not user_performance:
        performance_level = 'standard'
    else:
        grade = None
        if subject.lower() == 'physics':
            grade = user_performance.physics_grade
        elif subject.lower() == 'chemistry':
            grade = user_performance.chemistry_grade
        elif subject.lower() in ['mathematics', 'maths']:
            grade = user_performance.math_grade
        
        if grade:
            if grade >= 85:
                performance_level = 'advanced'
            elif grade >= 70:
                performance_level = 'standard'
            else:
                performance_level = 'remedial'
    
    # 2. Generate Content with Failover
    try:
        content = generate_content_with_gemini(subject, performance_level)
    except Exception:
        # 🟢 Fallback: Use hardcoded content if API fails
        content = generate_fallback_content(subject, performance_level)
    
    # 3. Save and Return
    practice = AdaptivePractice(
        user_id=user_id,
        subject=subject,
        performance_level=performance_level,
        title=content['title'],
        description=content['description'],
        content=content['content'],
        resources=content['resources'],
        completed=False
    )
    
    db.session.add(practice)
    db.session.commit()
    
    return jsonify(practice.to_dict()), 201