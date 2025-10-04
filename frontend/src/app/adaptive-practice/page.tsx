"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdaptivePracticeCard from '@/components/AdaptivePracticeCard';
import { Loader2 } from "lucide-react";
import { Label } from '@/components/ui/label';

interface AdaptivePractice {
  id: number;
  title: string;
  description: string;
  subject: string;
  performance_level: string;
  completed: boolean;
  created_at: string;
}

export default function AdaptivePracticePage() {
  const [practices, setPractices] = useState<AdaptivePractice[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [subject, setSubject] = useState("Mathematics");
  const [showSuccess, setShowSuccess] = useState(false);
  const userId = 1; // Mock user ID - would come from auth context in production

  const fetchPractices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/adaptive-practice?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch practices');
      const data = await response.json();
      setPractices(data);
    } catch (error) {
      console.error("Error fetching adaptive practices:", error);
      // Set empty array if API fails
      setPractices([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePractice = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/adaptive-practice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          subject: subject
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate practice');
      
      const newPractice = await response.json();
      setPractices([newPractice, ...practices]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating practice:', error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchPractices();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Adaptive Practice</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate New Practice</CardTitle>
            <CardDescription>
              Create a personalized practice session based on your performance and learning needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 w-full sm:w-1/3">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={generatePractice} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Practice"
                  )}
                </Button>
              </div>
            </div>
            {showSuccess && (
              <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
                Practice generated successfully!
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Practice Sessions</h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : practices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {practices.map((practice) => (
                <AdaptivePracticeCard
                  key={practice.id}
                  id={practice.id}
                  title={practice.title}
                  description={practice.description}
                  subject={practice.subject}
                  performanceLevel={practice.performance_level}
                  completed={practice.completed}
                  createdAt={practice.created_at}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No practice sessions found. Generate your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}