from flask import Blueprint, request, jsonify
from models.booster import PerformanceBooster
from models.assignment import Assignment
from app import db
import json

boosters_bp = Blueprint('boosters', __name__)

@boosters_bp.route('/', methods=['POST'])
def create_booster():
    data = request.json
    
    # Required fields
    required_fields = ['user_id', 'assignment_id', 'subject', 'assignment_title', 'grade', 'feedback']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Determine tier based on grade
    grade = float(data['grade'])
    if grade >= 90:
        tier = 1  # A-Range
    elif grade >= 80:
        tier = 2  # B-Range
    elif grade >= 70:
        tier = 3  # C-Range
    else:
        tier = 4  # D/F-Range
    
    # Generate booster content based on tier
    booster_content = generate_booster_content(
        tier, 
        data['subject'], 
        data['assignment_title'], 
        grade, 
        data['feedback']
    )
    
    # Create new booster
    new_booster = PerformanceBooster(
        user_id=data['user_id'],
        assignment_id=data['assignment_id'],
        subject=data['subject'],
        assignment_title=data['assignment_title'],
        grade=grade,
        feedback=data['feedback'],
        tier=tier,
        diagnostic_summary=booster_content['diagnostic_summary'],
        strategies=json.dumps(booster_content['strategies']),
        resources=json.dumps(booster_content['resources']),
        assessment=json.dumps(booster_content['assessment'])
    )
    
    db.session.add(new_booster)
    db.session.commit()
    
    return jsonify(new_booster.to_dict()), 201

@boosters_bp.route('/<user_id>', methods=['GET'])
def get_user_boosters(user_id):
    boosters = PerformanceBooster.query.filter_by(user_id=user_id).all()
    return jsonify([booster.to_dict() for booster in boosters]), 200

@boosters_bp.route('/<booster_id>', methods=['GET'])
def get_booster(booster_id):
    booster = PerformanceBooster.query.get(booster_id)
    if not booster:
        return jsonify({'error': 'Booster not found'}), 404
    return jsonify(booster.to_dict()), 200

def generate_booster_content(tier, subject, assignment_title, grade, feedback):
    """Generate content for the performance booster based on tier"""
    
    # Motivational headers by tier
    headers = {
        1: "🎯 From Excellence to Mastery",
        2: "📝 Elevating Your Strong Foundation",
        3: "🚀 Building Core Academic Strength",
        4: "🌱 Establishing Essential Skills"
    }
    
    # Tier-specific focus areas
    focus_areas = {
        1: "refining your analytical depth and developing originality in your work",
        2: "strengthening your organization and supporting evidence",
        3: "mastering core requirements and improving execution",
        4: "understanding instructions and building foundational skills"
    }
    
    # Generate diagnostic summary
    diagnostic_summary = f"{headers[tier]}\n\n"
    
    if tier == 1:
        diagnostic_summary += f"Your grade of {grade}% on '{assignment_title}' shows excellent work! "
    elif tier == 2:
        diagnostic_summary += f"Your grade of {grade}% on '{assignment_title}' demonstrates solid understanding. "
    elif tier == 3:
        diagnostic_summary += f"Your grade of {grade}% on '{assignment_title}' shows you're on the right track. "
    else:
        diagnostic_summary += f"Your grade of {grade}% on '{assignment_title}' indicates areas for improvement. "
    
    diagnostic_summary += f"The feedback indicates: {feedback}\n\n"
    diagnostic_summary += f"Your focus should be on {focus_areas[tier]}."
    
    # Generate strategies based on tier
    strategies = []
    if tier == 1:
        strategies = [
            "Schedule dedicated time for deeper research beyond required sources",
            "Create an outline that deliberately challenges conventional thinking on the topic",
            "Implement a peer review process with high-performing classmates"
        ]
    elif tier == 2:
        strategies = [
            "Create a detailed outline with clear topic sentences for each paragraph",
            "Develop an evidence tracking system to ensure claims are well-supported",
            "Schedule specific revision sessions focused solely on clarity and flow"
        ]
    elif tier == 3:
        strategies = [
            "Break down assignment requirements into a checklist before starting",
            "Create a timeline with specific milestones for each section of the assignment",
            "Use templates or examples to understand proper formatting and structure"
        ]
    else:
        strategies = [
            "Schedule a meeting with your instructor to clarify assignment expectations",
            "Create a basic outline that directly addresses each requirement point by point",
            "Set up a regular study schedule with short, focused sessions"
        ]
    
    # Generate resources based on tier and subject
    resources = []
    if tier <= 2:  # Advanced resources for higher tiers
        resources = [
            {"name": "Advanced Research Methods Guide", "url": "https://www.coursera.org/learn/research-methods"},
            {"name": "Critical Thinking in Academic Writing", "url": "https://owl.purdue.edu/owl/general_writing/academic_writing/"},
            {"name": f"Advanced {subject} Resources", "url": "https://scholar.google.com/"}
        ]
    else:  # Foundational resources for lower tiers
        resources = [
            {"name": "Understanding Assignment Rubrics", "url": "https://www.thoughtco.com/rubric-basics-3081258"},
            {"name": "Basic Academic Writing Structure", "url": "https://owl.purdue.edu/owl/general_writing/academic_writing/essay_writing/"},
            {"name": "Time Management for Students", "url": "https://www.mindtools.com/pages/article/newHTE_88.htm"}
        ]
    
    # Generate assessment questions based on tier
    assessment = {
        "questions": [
            {
                "type": "multiple_choice",
                "question": generate_question_1(tier, subject),
                "options": generate_options_1(tier),
                "correct_answer": 0  # Index of correct answer
            },
            {
                "type": "multiple_choice",
                "question": generate_question_2(tier, assignment_title),
                "options": generate_options_2(tier),
                "correct_answer": 0  # Index of correct answer
            },
            {
                "type": "short_answer",
                "question": "Write a 1-sentence revised thesis statement that is more specific than: 'This paper discusses the topic.'"
            },
            {
                "type": "short_answer",
                "question": f"Based on the feedback '{feedback}', what is the single most important change you must make for the next assignment?"
            },
            {
                "type": "multiple_choice",
                "question": generate_question_5(tier),
                "options": generate_options_5(tier),
                "correct_answer": 0  # Index of correct answer
            }
        ],
        "guidance": generate_guidance(tier, feedback)
    }
    
    return {
        "diagnostic_summary": diagnostic_summary,
        "strategies": strategies,
        "resources": resources,
        "assessment": assessment
    }

def generate_question_1(tier, subject):
    """Generate first question based on tier and subject"""
    if tier == 1:
        return f"When conducting research for an advanced {subject} assignment, which approach is most effective?"
    elif tier == 2:
        return f"Which organizational structure would best support a complex argument in {subject}?"
    elif tier == 3:
        return f"When citing sources in a {subject} assignment, what is the most important consideration?"
    else:
        return f"What is the first step you should take when receiving a new {subject} assignment?"

def generate_options_1(tier):
    """Generate options for first question based on tier"""
    if tier == 1:
        return [
            "Consulting peer-reviewed journals and primary sources",
            "Using only the required textbook",
            "Relying on general websites for information",
            "Asking classmates for their notes"
        ]
    elif tier == 2:
        return [
            "Thesis-driven structure with topic sentences that build upon each other",
            "Chronological order regardless of argument strength",
            "Random arrangement of facts and opinions",
            "Listing information without connecting ideas"
        ]
    elif tier == 3:
        return [
            "Ensuring all borrowed ideas are properly attributed",
            "Only citing direct quotes",
            "Citing only at the end of the paper",
            "Using as few citations as possible"
        ]
    else:
        return [
            "Carefully read all instructions and the rubric",
            "Start writing immediately",
            "Ask a friend what they're doing",
            "Wait until the day before to begin"
        ]

def generate_question_2(tier, assignment_title):
    """Generate second question based on tier and assignment title"""
    if tier == 1:
        return f"For an assignment like '{assignment_title}', what would elevate it from good to excellent?"
    elif tier == 2:
        return f"When developing your thesis for '{assignment_title}', what approach would strengthen your argument?"
    elif tier == 3:
        return f"What strategy would help ensure you meet all requirements for '{assignment_title}'?"
    else:
        return f"What is the most important first step when planning '{assignment_title}'?"

def generate_options_2(tier):
    """Generate options for second question based on tier"""
    if tier == 1:
        return [
            "Incorporating original analysis that extends beyond class discussions",
            "Using more quotes from the textbook",
            "Making the paper longer than required",
            "Using complex vocabulary throughout"
        ]
    elif tier == 2:
        return [
            "Making it specific, debatable, and supported by evidence",
            "Keeping it vague to cover more topics",
            "Making it as complex as possible with technical terms",
            "Focusing only on your personal opinion"
        ]
    elif tier == 3:
        return [
            "Creating a checklist of all requirements before starting",
            "Skimming the instructions quickly",
            "Focusing only on the parts you find interesting",
            "Waiting until you finish to check requirements"
        ]
    else:
        return [
            "Breaking down the assignment into smaller, manageable tasks",
            "Writing as much as possible in one sitting",
            "Focusing only on the introduction",
            "Skipping the planning phase entirely"
        ]

def generate_question_5(tier):
    """Generate fifth question based on tier"""
    if tier == 1:
        return "When is the optimal time to begin the editing process for a high-quality assignment?"
    elif tier == 2:
        return "What is the most effective approach to integrating evidence into your assignment?"
    elif tier == 3:
        return "What is the best strategy for managing your time on an assignment?"
    else:
        return "How should you approach asking for help with your assignment?"

def generate_options_5(tier):
    """Generate options for fifth question based on tier"""
    if tier == 1:
        return [
            "After completing a full draft, with enough time for multiple revision rounds",
            "The night before the deadline",
            "Only after receiving feedback from the instructor",
            "Only focusing on spelling and grammar checks"
        ]
    elif tier == 2:
        return [
            "Introduce evidence, explain its relevance, and connect it to your thesis",
            "Include as many quotes as possible without explanation",
            "Save all evidence for the conclusion",
            "Rely primarily on personal anecdotes instead of research"
        ]
    elif tier == 3:
        return [
            "Break the assignment into smaller tasks with specific deadlines",
            "Complete the entire assignment the day before it's due",
            "Focus on the easiest parts first and possibly skip difficult sections",
            "Work on multiple assignments simultaneously without a plan"
        ]
    else:
        return [
            "Be specific about what you don't understand and seek help early",
            "Wait until the last minute to ask questions",
            "Ask for general help without identifying specific issues",
            "Avoid asking for help to seem self-sufficient"
        ]

def generate_guidance(tier, feedback):
    """Generate guidance based on tier and feedback"""
    general_guidance = "Focus on addressing the specific feedback you received: " + feedback + "\n\n"
    
    if tier == 1:
        return general_guidance + "For excellence, focus on developing original insights and ensuring your work demonstrates mastery beyond course expectations."
    elif tier == 2:
        return general_guidance + "To strengthen your work, focus on improving the organization and ensuring each point is well-supported with evidence."
    elif tier == 3:
        return general_guidance + "To improve, ensure you're meeting all core requirements and develop a systematic approach to assignment completion."
    else:
        return general_guidance + "Start by mastering the fundamentals: understanding instructions, basic research skills, and meeting submission requirements."