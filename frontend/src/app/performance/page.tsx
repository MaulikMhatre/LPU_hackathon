
"use client"; 

import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, RefreshCw, BarChart, Zap, CheckCircle, Target, BookOpen, Clock } from 'lucide-react'; // Added more relevant Lucide icons
import { Button } from '@/components/ui/button';

// --- Mock Data ---
interface SubjectPerformance {
    subject: string;
    currentScore: number;
    target: number;
    lastQuiz: number;
    trend: number; // percentage change from previous average/quiz
}

interface OverallStats {
    avgScore: number;
    quizzesCompleted: number;
    masteredTopics: number;
    streakDays: number; // Added for more engagement
}

const PERFORMANCE_DATA: SubjectPerformance[] = [
    { subject: "Mathematics (Algebra)", currentScore: 85, target: 90, lastQuiz: 90, trend: 5 },
    { subject: "Physics (Kinematics)", currentScore: 62, target: 75, lastQuiz: 58, trend: -3 },
    { subject: "History (World War I)", currentScore: 91, target: 85, lastQuiz: 95, trend: 2 },
    { subject: "English (Writing & Grammar)", currentScore: 78, target: 80, lastQuiz: 75, trend: 3 },
    { subject: "Computer Science (Data Structures)", currentScore: 94, target: 90, lastQuiz: 98, trend: 7 },
];

const OVERALL_STATS: OverallStats = {
    avgScore: 79,
    quizzesCompleted: 42,
    masteredTopics: 15,
    streakDays: 7, 
};

// Sub-Components

const ProgressRing: React.FC<{ percent: number }> = ({ percent }) => {
    const radius = 40; 
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    
    const colorClass = percent >= 80 ? 'text-green-600' : percent >= 60 ? 'text-amber-600' : 'text-red-600';

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-200" 
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                />
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                />
            </svg>
            <span className={`absolute text-lg font-bold ${colorClass}`}>
                {percent}%
            </span>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconColor: string; 
    unit?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor, unit }) => (
    <div className="bg-card p-6 rounded-xl shadow-md border border-border transition-transform hover:scale-[1.01] hover:shadow-lg">
        <div className="flex items-center space-x-4 mb-2">
            <div className={`p-2 rounded-full ${iconColor} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        <h2 className="text-4xl font-extrabold text-foreground">{value}{unit && <span className="text-xl font-semibold text-muted-foreground ml-1">{unit}</span>}</h2>
    </div>
);


// Main Page Component
export default function PerformancePage() {
    return (
        <div className="p-6 md:p-8 bg-gray-50 text-foreground min-h-screen overflow-y-auto">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center mb-4 sm:mb-0">
                    <BarChart className="w-9 h-9 mr-4 text-teal-600" /> Performance Analytics
                </h1>
                <Button className="bg-teal-600 text-white h-11 px-6 text-base shadow-sm hover:bg-teal-700 transition-all">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
                </Button>
            </header>

            {/* Overall Stats */}
            <section className="grid gap-6 mb-10 lg:grid-cols-4">
                <StatCard 
                    title="Average Score" 
                    value={OVERALL_STATS.avgScore} 
                    unit="%" 
                    icon={BarChart} 
                    iconColor="text-teal-600" 
                />
                <StatCard 
                    title="Quizzes Completed" 
                    value={OVERALL_STATS.quizzesCompleted} 
                    icon={CheckCircle} 
                    iconColor="text-green-600" 
                />
                <StatCard 
                    title="Mastered Topics" 
                    value={OVERALL_STATS.masteredTopics} 
                    icon={BookOpen} 
                    iconColor="text-purple-600" 
                />
                <StatCard 
                    title="Learning Streak" 
                    value={OVERALL_STATS.streakDays} 
                    unit="days" 
                    icon={Zap} 
                    iconColor="text-amber-600" 
                />
            </section>

            <section className="bg-card p-8 rounded-2xl shadow-xl border border-border mb-10">
                <h3 className="text-2xl font-semibold text-foreground mb-8">Subject Breakdown</h3>
                <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">
                    {PERFORMANCE_DATA.map((data, index) => (
                        <div key={index} className="flex items-start space-x-6 pb-6 border-b border-border last:border-b-0 last:pb-0">
                            <ProgressRing percent={data.currentScore} />
                            <div className="flex-1 pt-2">
                                <h4 className="text-xl font-bold text-foreground mb-1">{data.subject}</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p className="flex items-center">
                                        <Target className="w-4 h-4 mr-2 text-teal-600" /> Target: <span className="font-semibold ml-1">{data.target}%</span>
                                    </p>
                                    <p className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-gray-500" /> Last Quiz: <span className="font-semibold ml-1">{data.lastQuiz}%</span>
                                    </p>
                                    <p className="flex items-center mt-2">
                                        Trend: 
                                        {data.trend > 0 ? (
                                            <span className="text-green-600 ml-2 flex items-center font-semibold"><TrendingUp className="w-4 h-4 mr-1" /> +{data.trend}%</span>
                                        ) : (
                                            <span className="text-red-600 ml-2 flex items-center font-semibold"><TrendingDown className="w-4 h-4 mr-1" /> {data.trend}%</span>
                                        )}
                                    </p>
                                </div>
                                <div className="mt-5">
                                    <Button variant="secondary" className="h-9 px-4 text-sm shadow-sm bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all">
                                        <Zap className="w-4 h-4 mr-2" /> Adaptive Practice
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-gradient-to-r from-teal-50 to-teal-100 border-l-4 border-teal-600 p-8 rounded-2xl shadow-md">
                <h3 className="text-2xl font-bold text-teal-700 mb-3 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-teal-600" /> Personalized Recommendation
                </h3>
                <p className="text-lg text-foreground leading-relaxed">
                    Based on your recent performance, your score in **Physics (Kinematics)** is currently below your target. We highly recommend focusing on **Module 3: Vector Analysis** and engaging with the practice problems.
                </p>
                <div className="mt-6">
                    <Link href="/physics/kinematics/module3" passHref>
                        <Button className="bg-teal-600 text-white h-11 px-6 text-base shadow-sm hover:bg-teal-700 transition-all">
                            Go to Recommended Module →
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}