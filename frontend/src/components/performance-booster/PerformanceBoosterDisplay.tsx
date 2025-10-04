"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, BookOpen, ListChecks, BrainCircuit } from 'lucide-react';

interface PerformanceBoosterDisplayProps {
  booster: any;
}

const PerformanceBoosterDisplay: React.FC<PerformanceBoosterDisplayProps> = ({ booster }) => {
  const [activeTab, setActiveTab] = useState('diagnostic');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Parse JSON strings if needed
  const strategies = typeof booster.strategies === 'string' 
    ? JSON.parse(booster.strategies) 
    : booster.strategies;
    
  const resources = typeof booster.resources === 'string' 
    ? JSON.parse(booster.resources) 
    : booster.resources;
    
  const assessment = typeof booster.assessment === 'string' 
    ? JSON.parse(booster.assessment) 
    : booster.assessment;

  const handleQuizAnswerChange = (questionIndex: number, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleShortAnswerChange = (questionIndex: number, value: string) => {
    setShortAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShortAnswers({});
    setShowResults(false);
  };

  // Helper to determine tier name
  const getTierName = (tier: number) => {
    switch (tier) {
      case 1: return "Tier 1: Refinement & Impact";
      case 2: return "Tier 2: Solid Structure & Detail";
      case 3: return "Tier 3: Core Requirements & Execution";
      case 4: return "Tier 4: Foundational Skill Building";
      default: return "Custom Tier";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold">
            Performance Booster: {booster.assignment_title}
          </CardTitle>
          <CardDescription className="text-white opacity-90">
            {booster.subject} • Grade: {booster.grade}% • {getTierName(booster.tier)}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="diagnostic" className="flex items-center gap-2">
            <BrainCircuit size={18} />
            <span>Diagnostic Summary</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen size={18} />
            <span>Resources & Strategies</span>
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <ListChecks size={18} />
            <span>Practice & Assessment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostic" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Summary & Strategic Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line">
                {booster.diagnostic_summary}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assignment Strategies</CardTitle>
              <CardDescription>
                Process improvement steps tailored to your performance level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {strategies.map((strategy: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>{strategy}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Resources</CardTitle>
              <CardDescription>
                High-quality, free resources to help improve your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {resources.map((resource: any, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-purple-100 text-purple-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {resource.name}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Practice & Assessment</CardTitle>
              <CardDescription>
                Test your understanding of key process skills needed for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {assessment.questions.map((question: any, qIndex: number) => (
                  <div key={qIndex} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3">Question {qIndex + 1}</h3>
                    <p className="mb-4">{question.question}</p>

                    {question.type === 'multiple_choice' ? (
                      <RadioGroup
                        value={quizAnswers[qIndex]}
                        onValueChange={(value) => handleQuizAnswerChange(qIndex, value)}
                        disabled={showResults}
                      >
                        <div className="space-y-3">
                          {question.options.map((option: string, oIndex: number) => (
                            <div key={oIndex} className={`flex items-start space-x-2 p-2 rounded ${
                              showResults && oIndex === question.correct_answer 
                                ? 'bg-green-50 border border-green-200' 
                                : showResults && quizAnswers[qIndex] === oIndex.toString() && oIndex !== question.correct_answer
                                  ? 'bg-red-50 border border-red-200'
                                  : ''
                            }`}>
                              <RadioGroupItem 
                                value={oIndex.toString()} 
                                id={`q${qIndex}-o${oIndex}`} 
                              />
                              <Label 
                                htmlFor={`q${qIndex}-o${oIndex}`}
                                className="flex-1"
                              >
                                {option}
                                {showResults && oIndex === question.correct_answer && (
                                  <span className="ml-2 text-green-600 inline-flex items-center">
                                    <CheckCircle size={16} className="mr-1" /> Correct
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : (
                      <div>
                        <Textarea
                          placeholder="Type your answer here..."
                          value={shortAnswers[qIndex] || ''}
                          onChange={(e) => handleShortAnswerChange(qIndex, e.target.value)}
                          disabled={showResults}
                          rows={3}
                          className="mb-2"
                        />
                        {showResults && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="font-medium text-blue-800">Guidance:</p>
                            <p className="text-blue-700">{assessment.guidance}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center mt-6">
                  {!showResults ? (
                    <Button onClick={handleSubmitQuiz} size="lg">
                      Submit Answers
                    </Button>
                  ) : (
                    <Button onClick={resetQuiz} variant="outline" size="lg">
                      Reset Quiz
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceBoosterDisplay;