

export interface StudentLeaderboardEntry {
  rank: number;
  studentId: string | number; // Unique identifier for the student
  studentName: string;
  averageScore: number;
  // Use this to highlight the row of the currently logged-in user
  isCurrentUser?: boolean; 
}

// Interface for general dashboard data
export interface DashboardData {
    studentName: string;
    currentRank: number;
    averageScore: number;
    hoursStudiedThisWeek: number;
    coursesCompleted: number;
    upcomingAssignments: { title: string; dueDate: string; course: string; }[];
    recentActivity: { title: string; description: string; time: string; }[];
}