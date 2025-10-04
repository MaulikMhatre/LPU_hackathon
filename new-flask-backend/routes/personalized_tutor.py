from flask import Blueprint, request, jsonify
import json
from app import db
from models.personalized_tutor import PersonalizedTutor, PerformanceHistory
import google.generativeai as genai
import os
from datetime import datetime

personalized_tutor_bp = Blueprint('personalized_tutor', __name__)

# Configure the Gemini API
API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBm4P9o5wn4DYiFjipaqc-sRMTZpLA-sRo')
genai.configure(api_key="AIzaSyBm4P9o5wn4DYiFjipaqc-sRMTZpLA-sRo")

# Helper function to determine performance level based on history
def determine_performance_level(user_id, subject):
    # Get the last 5 performance records for this user and subject
    history = PerformanceHistory.query.filter_by(
        user_id=user_id, 
        subject=subject
    ).order_by(PerformanceHistory.date_taken.desc()).limit(5).all()
    
    if not history:
        return 'medium'  # Default level if no history
    
    # Calculate average percentage
    avg_percentage = sum(record.percentage for record in history) / len(history)
    
    if avg_percentage < 60:
        return 'low'
    elif avg_percentage < 85:
        return 'medium'
    else:
        return 'high'

# Generate content using Gemini API
def generate_content_with_gemini(subject, performance_level):
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        # Create prompt based on subject and performance level
        if performance_level == 'low':
            difficulty = "basic concepts that need reinforcement"
        elif performance_level == 'medium':
            difficulty = "intermediate concepts to strengthen understanding"
        else:
            difficulty = "advanced concepts to challenge the student"
        
        prompt = f"""
        Create a personalized tutoring session for a student studying {subject}.
        Their performance level is: {performance_level} (they need {difficulty}).
        
        Please provide:
        1. A title for this tutoring session
        2. A brief explanation of a key concept in {subject} appropriate for their level
        3. 3-5 practice questions with multiple-choice answers (A, B, C, D)
        4. The correct answers to these questions
        
        Format the response as a JSON object with these fields:
        - title: string
        - content: string (the concept explanation)
        - quiz_data: array of question objects, each with:
          - question: string
          - options: array of 4 strings
          - correct_answer: string (A, B, C, or D)
        """
        
        response = model.generate_content(prompt)
        
        # Parse the response to extract JSON
        response_text = response.text
        
        # Find JSON content between triple backticks if present
        if "```json" in response_text and "```" in response_text.split("```json")[1]:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text and "```" in response_text.split("```")[1]:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text
        
        # Clean up any non-JSON content
        json_str = json_str.replace("```", "").strip()
        
        # Parse JSON
        content_data = json.loads(json_str)
        
        return {
            'title': content_data.get('title', f"Personalized {subject} Tutoring"),
            'content': content_data.get('content', "Content not available"),
            'quiz_data': json.dumps(content_data.get('quiz_data', []))
        }
    except Exception as e:
        print(f"Error generating content with Gemini: {str(e)}")
        return generate_fallback_content(subject, performance_level)

# Fallback content generator if API fails
def generate_fallback_content(subject, performance_level):
    title = f"Personalized {subject} Practice"
    
    if subject == "Physics":
        if performance_level == "low":
            content = "Let's review Newton's Laws of Motion. These fundamental principles describe the relationship between an object and the forces acting on it."
            quiz_data = [
                {
                    "question": "What is Newton's First Law?",
                    "options": ["Objects in motion stay in motion unless acted upon by a force", "Force equals mass times acceleration", "For every action there is an equal and opposite reaction", "Energy cannot be created or destroyed"],
                    "correct_answer": "A"
                }
            ]
        else:
            content = "Let's explore the concepts of work, energy, and power in physics systems."
            quiz_data = [
                {
                    "question": "What is the unit of power?",
                    "options": ["Joule", "Newton", "Watt", "Pascal"],
                    "correct_answer": "C"
                }
            ]
    elif subject == "Chemistry":
        content = "Let's review the periodic table and element properties."
        quiz_data = [
            {
                "question": "What element has the symbol 'Na'?",
                "options": ["Nitrogen", "Sodium", "Neon", "Nickel"],
                "correct_answer": "B"
            }
        ]
    elif subject == "Mathematics":
        content = "Let's practice solving quadratic equations using different methods."
        quiz_data = [
            {
                "question": "What is the quadratic formula?",
                "options": ["x = (-b ± √(b² - 4ac))/2a", "E = mc²", "a² + b² = c²", "F = ma"],
                "correct_answer": "A"
            }
        ]
    else:
        content = f"Let's review some key concepts in {subject}."
        quiz_data = [
            {
                "question": f"This is a sample question about {subject}",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "A"
            }
        ]
    
    return {
        'title': title,
        'content': content,
        'quiz_data': json.dumps(quiz_data)
    }

@personalized_tutor_bp.route('/api/personalized-tutor', methods=['GET'])
def get_personalized_tutors():
    try:
        user_id = request.args.get('user_id', type=int)
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        tutors = PersonalizedTutor.query.filter_by(user_id=user_id).order_by(PersonalizedTutor.created_at.desc()).all()
        return jsonify([tutor.to_dict() for tutor in tutors])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@personalized_tutor_bp.route('/api/personalized-tutor/<int:tutor_id>', methods=['GET'])
def get_personalized_tutor(tutor_id):
    try:
        tutor = PersonalizedTutor.query.get(tutor_id)
        if not tutor:
            return jsonify({'error': 'Tutor not found'}), 404
        
        return jsonify(tutor.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@personalized_tutor_bp.route('/api/personalized-tutor/generate', methods=['POST'])
def generate_personalized_tutor():
    try:
        data = request.json
        user_id = data.get('user_id')
        subject = data.get('subject')
        
        if not user_id or not subject:
            return jsonify({'error': 'User ID and subject are required'}), 400
        
        # Validate subject
        valid_subjects = ['Physics', 'Chemistry', 'Mathematics']
        if subject not in valid_subjects:
            return jsonify({'error': f'Subject must be one of: {", ".join(valid_subjects)}'}), 400
        
        # Determine performance level based on user's history
        performance_level = determine_performance_level(user_id, subject)
        
        # Generate content using Gemini API
        content_data = generate_content_with_gemini(subject, performance_level)
        
        # Create new personalized tutor entry
        new_tutor = PersonalizedTutor(
            user_id=user_id,
            subject=subject,
            performance_level=performance_level,
            title=content_data['title'],
            content=content_data['content'],
            quiz_data=content_data['quiz_data'],
            completed=False
        )
        
        db.session.add(new_tutor)
        db.session.commit()
        
        return jsonify(new_tutor.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@personalized_tutor_bp.route('/api/personalized-tutor/<int:tutor_id>/submit', methods=['POST'])
def submit_quiz_answers(tutor_id):
    try:
        data = request.json
        user_answers = data.get('answers', [])
        
        tutor = PersonalizedTutor.query.get(tutor_id)
        if not tutor:
            return jsonify({'error': 'Tutor not found'}), 404
        
        # Parse quiz data
        quiz_data = json.loads(tutor.quiz_data)
        
        # Calculate score
        correct_count = 0
        total_questions = len(quiz_data)
        
        for i, question in enumerate(quiz_data):
            if i < len(user_answers) and question['correct_answer'] == user_answers[i]:
                correct_count += 1
        
        score = (correct_count / total_questions) * 100 if total_questions > 0 else 0
        
        # Update tutor record
        tutor.completed = True
        tutor.score = score
        
        # Add to performance history
        new_performance = PerformanceHistory(
            user_id=tutor.user_id,
            subject=tutor.subject,
            quiz_id=tutor.id,
            score=correct_count,
            max_score=total_questions,
            percentage=score
        )
        
        db.session.add(new_performance)
        db.session.commit()
        
        return jsonify({
            'score': score,
            'correct_count': correct_count,
            'total_questions': total_questions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@personalized_tutor_bp.route('/api/personalized-tutor/performance-history', methods=['GET'])
def get_performance_history():
    try:
        user_id = request.args.get('user_id', type=int)
        subject = request.args.get('subject')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        query = PerformanceHistory.query.filter_by(user_id=user_id)
        
        if subject:
            query = query.filter_by(subject=subject)
        
        history = query.order_by(PerformanceHistory.date_taken.desc()).all()
        
        return jsonify([record.to_dict() for record in history])
    except Exception as e:
        return jsonify({'error': str(e)}), 500