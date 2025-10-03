
import React from 'react';
import { StudentLeaderboardEntry } from '@/types';

interface LeaderboardItemProps extends StudentLeaderboardEntry {
    isTopThree?: boolean; 
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ 
  rank, 
  studentName, 
  averageScore, 
  isCurrentUser,
  isTopThree
}) => {
  
  const baseClasses = "flex items-center justify-between transition-colors duration-150 py-3 rounded-lg";
  
  let rowClasses = `${baseClasses} hover:bg-teal-50/50`;
  let rankClasses = 'text-gray-500';
  let scoreClasses = 'text-gray-900';

  if (isCurrentUser) {
    
    rowClasses = `${baseClasses} bg-slate-100 border border-slate-300 font-semibold text-slate-800 shadow-sm`;
    rankClasses = 'text-slate-700';
  } else if (rank === 1) {
   
    rankClasses = 'text-amber-600 font-extrabold';
    scoreClasses = 'text-amber-700 font-extrabold';
  } else if (rank === 2) {
    rankClasses = 'text-gray-500';
  } else if (rank === 3) {
    rankClasses = 'text-yellow-800'; 
  }

  
  if (isTopThree) {
      rowClasses = `${baseClasses} flex-col md:flex-row md:space-x-4 bg-white/70 backdrop-blur-sm p-6 shadow-xl border-t-2 border-amber-400 mb-2`;
      rankClasses = 'text-4xl font-extrabold mb-2 md:mb-0';
      scoreClasses = 'text-3xl font-extrabold';
  }

  return (
    <div className={rowClasses}>
        <div className={`w-full md:w-1/12 text-center ${rankClasses}`}>
          {rank <= 3 ? (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉') : rank}
        </div>

        <div className="w-full md:w-6/12 text-left truncate px-4 md:text-base">
          {studentName}
        </div>

        <div className={`w-full md:w-4/12 text-right font-mono pr-4 ${scoreClasses}`}>
          {averageScore.toFixed(1)}%
        </div>
    </div>
  );
};

export default LeaderboardItem;