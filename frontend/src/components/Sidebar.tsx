
// src/components/Sidebar.tsx
"use client";

import React from 'react';
import { Home, BarChart3, Clock, Layers, User, BookOpenText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from './LogoutButton'; 
import { TrophyIcon, User as UserIcon, ClockIcon } from '@heroicons/react/24/outline'; 

// navigation items
const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Performance', href: '/performance', icon: BarChart3 },
    { name: 'Exams Schedule', href: '/schedule', icon: Clock },
    { name: 'Leaderboards', href: '/rank', icon: Layers },
    { name: 'Resources', href: '/resources', icon: BookOpenText },
    { name: 'Profile', href: '/profile', icon: User },
];


export function Sidebar() {
    const currentPath = usePathname();
    
    return (
        <div className="flex flex-col h-full bg-cyan-900 text-white border-r border-border shadow-md">
            
            {/* Logo/Title Section */}
            <div className="p-6 border-b border-cyan-700">
                <h1 className="text-xl font-bold text-teal-300 tracking-wider">
                    Smart EdTech
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href || 
                                     (currentPath.startsWith(item.href) && item.href !== '/');
                    
                    const activeClass = isActive
                        ? 'bg-teal-700 text-white font-semibold border-l-4 border-teal-300 shadow-inner'
                        : 'hover:bg-cyan-700 text-gray-200';

                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-150 ${activeClass}`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer and Logout Section */}
            <div className="p-4 border-t border-cyan-700 flex flex-col space-y-3">
                
                {/* User Info */}
                <div className="text-xs text-gray-400">
                    <p className="text-sm font-medium text-white">
                        Logged in as: {typeof window !== 'undefined' && localStorage.getItem('user') 
                            ? JSON.parse(localStorage.getItem('user')).name 
                            : 'Guest'}
                    </p>
                    <p className="mt-1">
                        Role: {typeof window !== 'undefined' && localStorage.getItem('user') 
                            ? JSON.parse(localStorage.getItem('user')).role || 'Student'
                            : 'Guest'} 
                        {typeof window !== 'undefined' && localStorage.getItem('user') && 
                            JSON.parse(localStorage.getItem('user')).level && 
                            ` | Level: ${JSON.parse(localStorage.getItem('user')).level}`}
                    </p>
                </div>
                
                {/* Logout Button Component */}
                <LogoutButton />
            </div>
        </div>
    );
}