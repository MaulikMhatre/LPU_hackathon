import React from 'react';
import LeaderboardItem from './leaderboardItem';
import { StudentLeaderboardEntry } from '@/types';
import { mockStudentLeaderboardData } from '@/mockData';
import { TrophyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function LeaderboardPage() {
  const isLoading = false; 
  const data: StudentLeaderboardEntry[] = mockStudentLeaderboardData;
  const title = "Class 10-B: Q3 Average Score Leaderboard";

  if (isLoading || !data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 min-h-screen">
        <p className="text-lg">
          {isLoading ? "Loading student results..." : "No student results to display for this period."}
        </p>
      </div>
    );
  }

  const topThree = data.slice(0, 3);
  const restOfList = data.slice(3);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        
       
        <div className="bg-gradient-to-r from-cyan-900 to-teal-800 text-white p-8 text-center">
          <TrophyIcon className="w-12 h-12 mx-auto mb-2 text-amber-300" />
          <h1 className="text-4xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-teal-200 text-lg">Recognizing academic excellence and achievement.</p>
        </div>

        {/* Top Performers Section */}
        <section className="p-6 md:p-8 bg-teal-50/50 border-b-4 border-teal-200">
             <h2 className="text-xl font-bold text-teal-800 mb-4 flex items-center">
                <TrophyIcon className="w-5 h-5 mr-2 text-amber-600" /> Top 3 Achievers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topThree.map((entry) => (
                    <LeaderboardItem
                        key={entry.studentId}
                        {...entry}
                        isTopThree={true} 
                    />
                ))}
            </div>
        </section>

        {/* Main List Section */}
        <section className="p-6">
            
           
            <div className="flex justify-between py-3 px-4 bg-gray-100/70 font-semibold text-gray-700 uppercase text-xs tracking-widest rounded-lg shadow-inner mb-2">
                <span className="w-1/12 text-center">#</span>
                <span className="w-6/12 text-left pl-4">Student Name</span>
                <span className="w-4/12 text-right pr-4">Avg. Score</span>
            </div>

            {/* Leaderboard Body (Rest of List) */}
            <div className="divide-y divide-gray-100">
                {restOfList.map((entry) => (
                    <LeaderboardItem
                        key={entry.studentId}
                        {...entry}
                    />
                ))}
            </div>
        </section>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-gray-600 bg-gray-100 border-t border-gray-200">
          <p>Data Accuracy: Scores are updated daily at midnight (EST).</p>
          <a href="#" className="text-teal-600 font-medium mt-2 inline-flex items-center hover:text-teal-800 transition-colors">
            Official Scoring Policy <ArrowRightIcon className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}