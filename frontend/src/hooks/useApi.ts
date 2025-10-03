import { useState, useEffect } from 'react';
import { authAPI, dashboardAPI, assignmentsAPI } from '@/lib/api';

// Hook for user data
export function useUserData(userId: string) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await dashboardAPI.getUserData(userId);
        setUserData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return { userData, loading, error };
}

// Hook for assignments
export function useAssignments(userId: string, status?: string) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await assignmentsAPI.getAssignments(userId, status);
        setAssignments(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId, status]);

  return { assignments, loading, error };
}

// Function to get current user from localStorage
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
  }
  return null;
}