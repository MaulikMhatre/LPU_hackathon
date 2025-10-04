import React from 'react';
import PerformanceBoosterDisplay from '@/components/performance-booster/PerformanceBoosterDisplay';

// Server component that fetches data
export default async function PerformanceBoosterDetailPage({ params }: { params: { id: string } }) {
  // Fetch the booster data from the API
  let booster = null;
  
  try {
    const response = await fetch(`http://localhost:3000/api/boosters/${params.id}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      booster = await response.json();
    } else {
      throw new Error('Failed to fetch booster data');
    }
  } catch (error) {
    console.error('Error fetching performance booster:', error);
    
    // Fallback to mock data for demonstration purposes
    booster = {
      id: params.id,
      user_id: "user-123",
      assignment_id: "assignment-1",
      subject: "Environmental Science",
      assignment_title: "Research Paper on Climate Change",
      grade: 85,
      feedback: "The thesis was unclear and the paper lacked sufficient peer-reviewed sources.",
      tier: 2,
      diagnostic_summary: "📝 Elevating Your Strong Foundation\n\nYour grade of 85% on 'Research Paper on Climate Change' demonstrates solid understanding. The feedback indicates: The thesis was unclear and the paper lacked sufficient peer-reviewed sources.\n\nYour focus should be on strengthening your organization and supporting evidence.",
      strategies: JSON.stringify([
        "Create a detailed outline with clear topic sentences for each paragraph",
        "Develop an evidence tracking system to ensure claims are well-supported",
        "Schedule specific revision sessions focused solely on clarity and flow"
      ]),
      resources: JSON.stringify([
        {"name": "Advanced Research Methods Guide", "url": "https://www.coursera.org/learn/research-methods"},
        {"name": "Critical Thinking in Academic Writing", "url": "https://owl.purdue.edu/owl/general_writing/academic_writing/"},
        {"name": "Advanced Environmental Science Resources", "url": "https://scholar.google.com/"}
      ]),
      assessment: JSON.stringify({
        "questions": [
          {
            "type": "multiple_choice",
            "question": "Which organizational structure would best support a complex argument in Environmental Science?",
            "options": [
              "Thesis-driven structure with topic sentences that build upon each other",
              "Chronological order regardless of argument strength",
              "Random arrangement of facts and opinions",
              "Listing information without connecting ideas"
            ],
            "correct_answer": 0
          },
          {
            "type": "multiple_choice",
            "question": "When developing your thesis for 'Research Paper on Climate Change', what approach would strengthen your argument?",
            "options": [
              "Making it specific, debatable, and supported by evidence",
              "Keeping it vague to cover more topics",
              "Making it as complex as possible with technical terms",
              "Focusing only on your personal opinion"
            ],
            "correct_answer": 0
          },
          {
            "type": "short_answer",
            "question": "Write a 1-sentence revised thesis statement that is more specific than: 'This paper discusses the topic.'"
          },
          {
            "type": "short_answer",
            "question": "Based on the feedback 'The thesis was unclear and the paper lacked sufficient peer-reviewed sources', what is the single most important change you must make for the next assignment?"
          },
          {
            "type": "multiple_choice",
            "question": "What is the most effective approach to integrating evidence into your assignment?",
            "options": [
              "Introduce evidence, explain its relevance, and connect it to your thesis",
              "Include as many quotes as possible without explanation",
              "Save all evidence for the conclusion",
              "Rely primarily on personal anecdotes instead of research"
            ],
            "correct_answer": 0
          }
        ],
        "guidance": "Focus on addressing the specific feedback you received: The thesis was unclear and the paper lacked sufficient peer-reviewed sources\n\nTo strengthen your work, focus on improving the organization and ensuring each point is well-supported with evidence."
      }),
      created_at: new Date().toISOString()
    };
  }

  return (
    <div className="container mx-auto py-8">
      <PerformanceBoosterDisplay booster={booster} />
    </div>
  );
}