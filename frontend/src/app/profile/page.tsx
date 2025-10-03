
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Zap, BookOpenText, Lock, Edit, Shield, TrendingUp, ChevronRight } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock Data
interface UserData {
    name: string;
    email: string;
    role: string;
    level: number;
    points: number;
    coursesEnrolled: number;
}

const INITIAL_USER_DATA: UserData = {
    name: "Ujjwal Rai",
    email: "ujjwal.rai@smartlearn.com",
    role: "Student",
    level: 5,
    points: 1210,
    coursesEnrolled: 4,
};

const XP_FOR_NEXT_LEVEL = 1500; 
const CURRENT_XP = INITIAL_USER_DATA.points;
const XP_PROGRESS_PERCENT = Math.min(100, (CURRENT_XP / XP_FOR_NEXT_LEVEL) * 100);


//  Stat Card
interface StatTileProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconBgClass: string; 
    textColorClass: string; 
}

const ElegantStatTile: React.FC<StatTileProps> = ({ title, value, icon: Icon, iconBgClass, textColorClass }) => (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-full ${iconBgClass}`}>
            <Icon className={`w-5 h-5 ${textColorClass}`} />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
    </div>
);


// Main Page Component
export default function ProfilePage() {
    const [userData, setUserData] = useState(INITIAL_USER_DATA);
    const [isEditing, setIsEditing] = useState(false);
    const [formName, setFormName] = useState(userData.name);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setUserData(prev => ({ ...prev, name: formName }));
        setIsEditing(false);
       
    };

    return (
        <div className="p-6 md:p-10 bg-gray-50 text-foreground min-h-screen">
            <header className="mb-10 flex justify-between items-center border-b border-gray-200 pb-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center">
                    
                    <User className="w-8 h-8 mr-4 text-teal-600" /> My Profile
                </h1>
                <Button 
                    onClick={() => setIsEditing(!isEditing)} 
                    variant={isEditing ? 'outline' : 'default'}
                   
                    className={`h-10 px-5 text-base font-semibold shadow-sm hover:shadow-md transition-all ${isEditing ? 'border-red-400 text-red-600 hover:bg-red-50' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'} <Edit className="w-4 h-4 ml-2" /> 
                </Button>
            </header>

            <div className="grid lg:grid-cols-12 gap-10">
                
               
                <div className="lg:col-span-4 space-y-8">
                    
                   
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                        
                      
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-600"></div>

                        <div className="w-32 h-32 bg-teal-100/30 text-teal-600 rounded-full mx-auto flex items-center justify-center text-5xl font-extrabold mb-4 ring-4 ring-teal-200 transition-transform hover:scale-105">
                            {userData.name[0]}
                        </div>
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{userData.name}</h2>
                        <p className="text-base text-muted-foreground mt-1">{userData.role} • {userData.email}</p>
                        
                       
                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                             
                                <span className="text-lg text-teal-600 font-bold flex items-center">
                                    <Zap className="w-5 h-5 mr-1" /> Level {userData.level}
                                </span>
                                <span className="text-sm text-muted-foreground">Progress: {XP_PROGRESS_PERCENT.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                
                                    className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 shadow-md" 
                                    style={{ width: `${XP_PROGRESS_PERCENT}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Current XP: {CURRENT_XP.toLocaleString()} / {XP_FOR_NEXT_LEVEL.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                   
                    <div className="space-y-4">
                        <ElegantStatTile 
                            title="Total Points" 
                            value={userData.points.toLocaleString()} 
                            icon={TrendingUp} 
                            iconBgClass="bg-green-100/50"
                            textColorClass="text-green-600"
                        />
                        <ElegantStatTile 
                            title="Courses Enrolled" 
                            value={userData.coursesEnrolled} 
                            icon={BookOpenText} 
                            iconBgClass="bg-teal-100/50" 
                            textColorClass="text-teal-600"
                        />
                    </div>
                </div>

              
                <div className="lg:col-span-8 space-y-8">
                    
                    
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-gray-100 pb-3">
                            Personal Information
                        </h3>
                        
                        <form onSubmit={handleSave} className="space-y-6">
                          
                            <div>
                                <Label htmlFor="name" className="text-base font-medium flex items-center mb-1">
                                    
                                    <User className="w-4 h-4 mr-2 text-teal-600" /> Full Name
                                </Label>
                                <Input 
                                    id="name" 
                                    value={formName} 
                                    onChange={(e) => setFormName(e.target.value)} 
                                    disabled={!isEditing} 
                                   
                                    className={`mt-1 h-11 text-base transition-colors ${!isEditing ? 'bg-gray-50 border-gray-200' : 'bg-white border-teal-500/50 focus-visible:ring-teal-500'}`} 
                                />
                            </div>

                            
                            <div>
                                <Label htmlFor="email" className="text-base font-medium flex items-center mb-1">
                                    <Mail className="w-4 h-4 mr-2 text-teal-500" /> Email Address
                                </Label>
                                <Input 
                                    id="email" 
                                    value={userData.email} 
                                    disabled 
                                    className="mt-1 h-11 text-base bg-gray-100 border-dashed cursor-not-allowed" 
                                />
                            </div>
                            
                            {isEditing && (
                                <div className="pt-4 flex justify-start">
                                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-6 text-base font-semibold shadow-md">
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>
                    
                   
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex justify-between items-center transition-transform hover:shadow-xl hover:-translate-y-0.5">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-100/50 rounded-full">
                                <Lock className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Security & Password</h3>
                                <p className="text-sm text-muted-foreground">Update your credentials and two-factor settings.</p>
                            </div>
                        </div>
                        <Link href="/settings/security" passHref>
                            <Button variant="ghost" className="text-teal-600 hover:text-teal-800 group">
                                Manage <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}