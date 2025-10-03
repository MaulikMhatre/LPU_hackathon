// API service for communicating with the backend

const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch function with error handling
async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) => {
    return fetchFromAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: (credentials: { email: string; password: string }) => {
    return fetchFromAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  resetPassword: async ({ email }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Password reset request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Password reset error:', error);
            throw new Error('Password reset failed. Please try again later.');
        }
    },
};

// Dashboard API
export const dashboardAPI = {
  getUserData: (userId: string) => {
    return fetchFromAPI(`/dashboard/user/${userId}`);
  },
};

// Assignments API
export const assignmentsAPI = {
  getAssignments: (userId: string, status?: string) => {
    const queryParams = status ? `?status=${status}` : '';
    return fetchFromAPI(`/assignments/${userId}${queryParams}`);
  },
  
  createAssignment: (assignmentData: {
    user_id: string;
    title: string;
    subject: string;
    description: string;
    due_date: string;
  }) => {
    return fetchFromAPI('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },
  
  updateAssignment: (assignmentId: string, updateData: {
    status?: string;
    score?: number;
  }) => {
    return fetchFromAPI(`/assignments/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
};

export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  assignments: assignmentsAPI,
};