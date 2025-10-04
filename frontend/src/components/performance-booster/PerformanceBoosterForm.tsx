"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PerformanceBoosterFormProps {
  userId: string;
  assignments?: any[];
}

const PerformanceBoosterForm: React.FC<PerformanceBoosterFormProps> = ({ userId, assignments = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assignment_id: '',
    subject: '',
    assignment_title: '',
    grade: '',
    feedback: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // If assignment is selected, auto-fill subject and title
    if (name === 'assignment_id' && value) {
      const selectedAssignment = assignments.find(a => a.id === value);
      if (selectedAssignment) {
        setFormData(prev => ({
          ...prev,
          subject: selectedAssignment.subject,
          assignment_title: selectedAssignment.title
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.subject || !formData.assignment_title || !formData.grade || !formData.feedback) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/boosters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create performance booster');
      }

      const data = await response.json();
      toast.success('Performance Booster created successfully!');
      
      // Navigate to the newly created booster
      router.push(`/performance-booster/${data.id}`);
    } catch (error) {
      console.error('Error creating performance booster:', error);
      toast.error('Failed to create performance booster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Performance Booster</CardTitle>
        <CardDescription>
          Generate a personalized performance booster based on your assignment grade and feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment_id">Assignment (Optional)</Label>
            <Select 
              value={formData.assignment_id} 
              onValueChange={(value) => handleSelectChange('assignment_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an assignment" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Select an existing assignment or manually enter details below
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject/Course*</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., College English, Data Structures"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignment_title">Assignment Title/Type*</Label>
            <Input
              id="assignment_title"
              name="assignment_title"
              value={formData.assignment_title}
              onChange={handleChange}
              placeholder="e.g., Persuasive Essay on Climate Change"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Recent Grade/Score*</Label>
            <Input
              id="grade"
              name="grade"
              type="number"
              min="0"
              max="100"
              value={formData.grade}
              onChange={handleChange}
              placeholder="e.g., 85"
              required
            />
            <p className="text-sm text-gray-500">Enter as a percentage (0-100)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Specific Feedback Received*</Label>
            <Textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="e.g., The thesis was unclear, Lacked proper citation"
              rows={4}
              required
            />
            <p className="text-sm text-gray-500">
              This is crucial for generating personalized recommendations
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Performance Booster'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PerformanceBoosterForm;