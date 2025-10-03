"use client";

import React, { useEffect, useState } from 'react';
import { TrophyIcon, AcademicCapIcon, ClockIcon, ChartBarIcon, ClipboardDocumentListIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useUserData, useAssignments, getCurrentUser } from '@/hooks/useApi';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    unit?: string;
    trend?: string;
    colorClass: string; 
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, unit, trend, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {unit && <span className="ml-1 text-gray-500 text-sm">{unit}</span>}
            </div>
            {trend && (
                <p className="mt-2 text-xs font-medium text-green-600">
                    {trend}
                </p>
            )}
        </div>
    );
};

export default function Dashboard() {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);
    
    const userId = user?.id || '';
    const { userData, loading: userLoading } = useUserData(userId);
    const { assignments, loading: assignmentsLoading } = useAssignments(userId, 'pending');
    
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Please sign in to view your dashboard</h2>
                    <Link href="/sections/signin" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }
    
    if (userLoading || assignmentsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Loading your dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {userData?.name || user.name}</h1>
                <p className="text-gray-600 mt-1">Here's an overview of your academic progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Current Rank" 
                    value={userData?.level || 0} 
                    icon={TrophyIcon} 
                    colorClass="text-yellow-500" 
                />
                <StatCard 
                    title="Average Score" 
                    value={userData?.performance?.score || 0} 
                    unit="%" 
                    icon={ChartBarIcon} 
                    colorClass="text-blue-500" 
                />
                <StatCard 
                    title="Hours Studied" 
                    value={userData?.hours_studied || 0} 
                    unit="hrs" 
                    trend={userData?.hours_trend || ""}
                    icon={ClockIcon} 
                    colorClass="text-green-500" 
                />
                <StatCard 
                    title="Courses Completed" 
                    value={userData?.courses_completed || 0} 
                    icon={AcademicCapIcon} 
                    colorClass="text-purple-500" 
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Assignments */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-blue-500" />
                            Upcoming Assignments
                        </h2>
                        <Link href="/schedule" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {assignments && assignments.length > 0 ? (
                            assignments.map((assignment, index) => (
                                <div key={index} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-150">
                                    <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm text-gray-500">{assignment.subject}</span>
                                        <span className="text-sm font-medium text-red-500">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">No upcoming assignments</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <SparklesIcon className="w-5 h-5 mr-2 text-purple-500" />
                            Recent Activity
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {userData?.activities && userData.activities.length > 0 ? (
                            userData.activities.slice(0, 3).map((activity, index) => (
                                <div key={index} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-150">
                                    <h3 className="font-semibold text-gray-800">{activity.activity_type}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">{new Date(activity.created_at).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}