
"use client";
import React, { useState, FormEvent } from 'react';
import { Clock, Plus, Trash2, Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScheduleItem {
    id: number;
    name: string;
    date: string;
    status: 'Upcoming' | 'Completed' | 'Missed';
}

// Mock data
const INITIAL_SCHEDULE: ScheduleItem[] = [
    { id: 1, name: "Chemistry Midterm", date: "2025-11-15", status: "Upcoming" },
    { id: 2, name: "English Essay Final", date: "2025-11-20", status: "Upcoming" },
    { id: 3, name: "Adaptive Quiz: History", date: "2025-10-01", status: "Completed" },
    { id: 4, name: "Math: Vector Analysis Test", date: "2025-09-10", status: "Completed" },
    { id: 5, name: "Biology Project Due", date: "2025-09-05", status: "Missed" },
];

const StatusBadge: React.FC<{ status: ScheduleItem['status'] }> = ({ status }) => {
    let classes = "";
    let icon = null;

    switch (status) {
        case 'Upcoming':
            classes = "bg-amber-100 text-amber-800 border-amber-300";
            icon = <Clock className="w-3 h-3 mr-1" />;
            break;
        case 'Completed':
            classes = "bg-teal-100 text-teal-800 border-teal-300";
            icon = <Check className="w-3 h-3 mr-1" />;
            break;
        case 'Missed':
            classes = "bg-red-100 text-red-800 border-red-300";
            icon = <X className="w-3 h-3 mr-1" />;
            break;
    }

    return (
        <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-semibold border ${classes}`}>
            {icon} {status}
        </span>
    );
};

export default function SchedulePage() {
    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    const handleAddExam = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !date) return;

        const newItem: ScheduleItem = {
            id: Date.now(),
            name,
            date,
            status: 'Upcoming',
        };

        
        const newSchedule = [...schedule, newItem].sort((a, b) => {
            if (a.status === 'Upcoming' && b.status !== 'Upcoming') return -1;
            if (a.status !== 'Upcoming' && b.status === 'Upcoming') return 1;
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setSchedule(newSchedule);
        setName('');
        setDate('');
    };

    const handleDeleteExam = (id: number) => {
        setSchedule(schedule.filter(item => item.id !== id));
    };

    const upcomingSchedule = schedule.filter(item => item.status === 'Upcoming');
    const pastSchedule = schedule.filter(item => item.status !== 'Upcoming').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-6 md:p-10 bg-gray-50 text-foreground min-h-screen">
            <header className="mb-10 border-b border-gray-200 pb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center">
                    <Clock className="w-9 h-9 mr-4 text-teal-600" /> Exam and Deadline Schedule
                </h1>
                <p className="text-lg text-muted-foreground mt-2">Manage all your critical upcoming exams, quizzes, and assignment deadlines.</p>
            </header>

            {/* Add New Exam Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-10">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center text-teal-700">
                    <Plus className="w-5 h-5 mr-3" /> Schedule a New Item
                </h3>
                <form onSubmit={handleAddExam} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-2">
                        <Label htmlFor="exam-name" className="font-semibold">Exam/Assignment Name</Label>
                        <Input 
                            id="exam-name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="e.g., Biology Quiz, Math Homework" 
                            className="mt-2 h-11 text-base" 
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="exam-date" className="font-semibold">Due Date</Label>
                        <Input 
                            id="exam-date" 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            className="mt-2 h-11 text-base" 
                            required
                        />
                    </div>
                    
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-4 font-semibold shadow-md transition-all">
                        <Calendar className="w-4 h-4 mr-2" /> Add to Schedule
                    </Button>
                </form>
            </div>

            {/* Upcoming Schedule Table */}
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 mb-10">
                <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-gray-100 pb-3">
                    Upcoming Deadlines <span className="text-teal-600 ml-2">({upcomingSchedule.length})</span>
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="text-muted-foreground border-b border-gray-200 text-xs uppercase tracking-wider bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 font-bold rounded-tl-lg">Name</th>
                                <th className="py-3 px-4 font-bold">Date</th>
                                <th className="py-3 px-4 font-bold">Status</th>
                                <th className="py-3 px-4 font-bold text-right rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingSchedule.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-teal-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-base text-gray-800">{item.name}</td>
                                    <td className="py-4 px-4 font-mono text-base text-gray-700">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Button 
                                            onClick={() => handleDeleteExam(item.id)}
                                            variant="ghost" 
                                            className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {upcomingSchedule.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 border-t border-gray-100 mt-0">You have no upcoming deadlines. Great job staying ahead!</p>
                )}
            </div>

            {/* Past Schedule Table */}
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-gray-100 pb-3">
                    Past Events <span className="text-muted-foreground ml-2">({pastSchedule.length})</span>
                </h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm opacity-80">
                         <thead className="text-muted-foreground border-b border-gray-200 text-xs uppercase tracking-wider bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 font-bold rounded-tl-lg">Name</th>
                                <th className="py-3 px-4 font-bold">Date</th>
                                <th className="py-3 px-4 font-bold">Status</th>
                                <th className="py-3 px-4 font-bold text-right rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastSchedule.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-base text-gray-800">{item.name}</td>
                                    <td className="py-4 px-4 font-mono text-base text-gray-700">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-4 px-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Button 
                                            onClick={() => handleDeleteExam(item.id)}
                                            variant="ghost"
                                            className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}