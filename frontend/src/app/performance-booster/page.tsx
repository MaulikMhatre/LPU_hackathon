import React from 'react';
import PerformanceBoosterForm from '@/components/performance-booster/PerformanceBoosterForm';

// This would normally be a server component that fetches data
export default async function PerformanceBoosterPage() {
  // In a real application, you would get the userId from authentication context
  const userId = "user-123"; // Placeholder user ID
  
  // Fetch assignments from the API
  let assignments = [];
  try {
    const response = await fetch('http://localhost:5000/api/assignments', {
      cache: 'no-store'
    });
    
    if (response.ok) {
      assignments = await response.json();
    }
  } catch (error) {
    console.error('Error fetching assignments:', error);
    // Fallback to empty array, already set as default
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Performance Booster Generator</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600">
        Generate a personalized Performance Booster Page to help improve your understanding and performance
        in a specific subject based on your recent assignment grade.
      </p>
      
      <PerformanceBoosterForm 
        userId={userId} 
        assignments={assignments} 
      />
    </div>
  );
}