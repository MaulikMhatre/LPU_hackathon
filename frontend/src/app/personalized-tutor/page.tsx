"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Define types
interface PersonalizedTutor {
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

interface PerformanceHistory {
  id: number;
  user_id: number;
  subject: string;
  quiz_id: number | null;
  score: number;
  max_score: number;
  percentage: number;
  date_taken: string;
}

export default function PersonalizedTutorPage() {
  const [tutors, setTutors] = useState<PersonalizedTutor[]>([]);
  const [history, setHistory] = useState<PerformanceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [subject, setSubject] = useState("Physics");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("tutors");

  // Get user ID from localStorage
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user).id;
      }
    }
    return 1; // Default user ID if not found
  };

  // Fetch personalized tutors
  const fetchTutors = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const response = await fetch(`/api/personalized-tutor?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTutors(data);
      } else {
        console.error('Failed to fetch personalized tutors');
      }
    } catch (error) {
      console.error('Error fetching personalized tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch performance history
  const fetchHistory = async () => {
    try {
      const userId = getUserId();
      const response = await fetch(`/api/personalized-tutor/performance-history?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.error('Failed to fetch performance history');
      }
    } catch (error) {
      console.error('Error fetching performance history:', error);
    }
  };

  // Generate new personalized tutor
  const generateTutor = async () => {
    setGenerating(true);
    try {
      const userId = getUserId();
      const response = await fetch('/api/personalized-tutor/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          subject: subject,
        }),
      });

      if (response.ok) {
        await fetchTutors();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error('Failed to generate personalized tutor');
      }
    } catch (error) {
      console.error('Error generating personalized tutor:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTutors();
    fetchHistory();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personalized Tutor</h1>
          <p className="text-muted-foreground">
            Get personalized tutoring sessions based on your performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateTutor} disabled={generating}>
            {generating ? "Generating..." : "Generate Tutor Session"}
          </Button>
        </div>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            New personalized tutor session has been generated.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tutors">Tutor Sessions</TabsTrigger>
          <TabsTrigger value="performance">Performance History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tutors" className="space-y-4 mt-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutors.map((tutor) => (
                <Card key={tutor.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{tutor.title}</CardTitle>
                        <CardDescription>
                          {tutor.subject} • {formatDate(tutor.created_at)}
                        </CardDescription>
                      </div>
                      {tutor.completed && (
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Completed
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="line-clamp-3 text-sm text-gray-600">
                      {tutor.content.substring(0, 150)}...
                    </p>
                    {tutor.completed && tutor.score !== null && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm font-medium">Score: </span>
                        <span className="ml-1 text-sm">
                          {tutor.score.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/personalized-tutor/${tutor.id}`} passHref>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {tutor.completed ? "Review Session" : "Start Session"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No tutor sessions yet</h3>
              <p className="text-muted-foreground mt-1">
                Generate your first personalized tutor session by selecting a subject and clicking the "Generate Tutor Session" button.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          {history.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
                <CardDescription>
                  Your performance across all subjects and quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Subject</th>
                        <th className="px-6 py-3">Score</th>
                        <th className="px-6 py-3">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((record) => (
                        <tr key={record.id} className="border-b">
                          <td className="px-6 py-4">{formatDate(record.date_taken)}</td>
                          <td className="px-6 py-4">{record.subject}</td>
                          <td className="px-6 py-4">
                            {record.score} / {record.max_score}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    record.percentage >= 70
                                      ? "bg-green-600"
                                      : record.percentage >= 40
                                      ? "bg-yellow-400"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${record.percentage}%` }}
                                ></div>
                              </div>
                              <span className="ml-2">{record.percentage.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No performance history yet</h3>
              <p className="text-muted-foreground mt-1">
                Complete tutor sessions to build your performance history.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}