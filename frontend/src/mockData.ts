

// src/mockData.ts
import { StudentLeaderboardEntry } from './types';

const generateMockData = (): StudentLeaderboardEntry[] => {
  const names = [
    'Anya Sharma', 'Ben Carter', 'Chloe Kim', 'David Lee (You)', 'Emily Jones',
    'Finnegan O’Connell', 'Grace Hopper', 'Henry Ford', 'Ivy Queen', 'Jack Sparrow',
    'Kira Yamato', 'Liam Gallagher', 'Mia Wallace', 'Noah Centineo', 'Olivia Newton',
    'Peter Quill', 'Quinn Fabray', 'Ryan Gosling', 'Sara Lance', 'Tom Hardy',
  ];
  
  const unsortedData = names.map((name, index) => {
    let score = Math.floor(70 + Math.random() * 300) / 4; 
    score = Math.max(55.0, Math.min(99.9, score));

    return {
      rank: 0,
      studentId: 1000 + index,
      studentName: name,
      averageScore: parseFloat(score.toFixed(1)),
      isCurrentUser: name.includes('(You)'), 
    };
  });

  unsortedData.sort((a, b) => b.averageScore - a.averageScore);

  const finalData = unsortedData.map((student, index) => ({
    ...student,
    rank: index + 1,
  }));

  return finalData;
};

export const mockStudentLeaderboardData: StudentLeaderboardEntry[] = generateMockData();