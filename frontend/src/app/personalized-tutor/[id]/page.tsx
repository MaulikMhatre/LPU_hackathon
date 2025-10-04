"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Quiz {
  question: string;
  options: string[];
  correct_answer: string;
}

interface TutorDetail {
  id: number;
  user_id: number;
  subject: string;
  performance_level: string;
  title: string;
  content: string;
  quiz_data: string;
  completed: boolean;
  score: number | null;
  created_at: string;
}

export default function TutorDetailPage({ params }: { params: { id: string } }) {
  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<Quiz[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correct_count: number; total_questions: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch tutor details
  useEffect(() => {
    const fetchTutorDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/personalized-tutor/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setTutor(data);
          
          // Parse quiz data
          if (data.quiz_data) {
            try {
              const parsedQuizData = JSON.parse(data.quiz_data);
              setQuizData(parsedQuizData);
              setUserAnswers(new Array(parsedQuizData.length).fill(''));
            } catch (e) {
              console.error('Error parsing quiz data:', e);
              setQuizData([]);
            }
          }
          
          // If already completed, set submitted to true
          if (data.completed) {
            setSubmitted(true);
            if (data.score !== null) {
              setResult({
                score: data.score,
                correct_count: Math.round((data.score / 100) * (JSON.parse(data.quiz_data).length)),
                total_questions: JSON.parse(data.quiz_data).length
              });
            }
          }
        } else {
          setError('Failed to fetch tutor details');
        }
      } catch (error) {
        console.error('Error fetching tutor details:', error);
        setError('An error occurred while fetching tutor details');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetail();
  }, [params.id]);

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  // Submit quiz answers
  const handleSubmit = async () => {
    // Check if all questions are answered
    if (userAnswers.some(answer => answer === '')) {
      setError('Please answer all questions before submitting');
      return;
    }

    try {
      const response = await fetch(`/api/personalized-tutor/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: userAnswers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setSubmitted(true);
        setError(null);
      } else {
        setError('Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('An error occurred while submitting answers');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !tutor) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/personalized-tutor" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tutor Sessions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/personalized-tutor" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Tutor Session</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{tutor.title}</CardTitle>
              <CardDescription>
                {tutor.subject} • {formatDate(tutor.created_at)} • 
                Performance Level: {tutor.performance_level.charAt(0).toUpperCase() + tutor.performance_level.slice(1)}
              </CardDescription>
            </div>
            {submitted && result && (
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                result.score >= 70 ? "bg-green-100 text-green-800" : 
                result.score >= 40 ? "bg-yellow-100 text-yellow-800" : 
                "bg-red-100 text-red-800"
              }`}>
                Score: {result.score.toFixed(1)}%
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium mb-2">Learning Content</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {tutor.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Practice Quiz</h3>
            
            {quizData.map((quiz, index) => (
              <div key={index} className={`p-4 rounded-md ${
                submitted ? (userAnswers[index] === quiz.correct_answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200') : 'bg-gray-50'
              }`}>
                <p className="font-medium mb-2">
                  {index + 1}. {quiz.question}
                </p>
                <RadioGroup 
                  value={userAnswers[index]} 
                  onValueChange={(value) => handleAnswerSelect(index, value)}
                  disabled={submitted}
                  className="space-y-2"
                >
                  {quiz.options.map((option, optionIndex) => {
                    const optionValue = String.fromCharCode(65 + optionIndex); // A, B, C, D
                    const isCorrect = quiz.correct_answer === optionValue;
                    const isSelected = userAnswers[index] === optionValue;
                    
                    return (
                      <div key={optionIndex} className={`flex items-center space-x-2 p-2 rounded ${
                        submitted && isCorrect ? 'bg-green-100' : 
                        submitted && isSelected && !isCorrect ? 'bg-red-100' : ''
                      }`}>
                        <RadioGroupItem value={optionValue} id={`q${index}-option${optionIndex}`} />
                        <Label htmlFor={`q${index}-option${optionIndex}`} className="flex-1">
                          {optionValue}. {option}
                        </Label>
                        {submitted && isCorrect && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
                {submitted && userAnswers[index] !== quiz.correct_answer && (
                  <p className="text-sm text-red-600 mt-2">
                    Correct answer: {quiz.correct_answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/personalized-tutor" passHref>
            <Button variant="outline">
              Back to All Sessions
            </Button>
          </Link>
          
          {!submitted ? (
            <Button onClick={handleSubmit}>
              Submit Answers
            </Button>
          ) : result && (
            <div className="text-right">
              <p className="text-sm mb-1">
                You got {result.correct_count} out of {result.total_questions} questions correct
              </p>
              <p className={`text-sm font-medium ${
                result.score >= 70 ? "text-green-600" : 
                result.score >= 40 ? "text-yellow-600" : 
                "text-red-600"
              }`}>
                Final Score: {result.score.toFixed(1)}%
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}