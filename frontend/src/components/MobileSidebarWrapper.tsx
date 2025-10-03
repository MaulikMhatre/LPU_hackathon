

// src/components/MobileSidebarWrapper.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

interface MobileSidebarWrapperProps {
  children: React.ReactNode;
}

// 🔑 FIX: Dynamic import with ssr: false to prevent hydration crash
const DynamicSidebar = dynamic(() => import('@/components/Sidebar').then(mod => mod.Sidebar), {
    ssr: false, 
});


export function MobileSidebarWrapper({ children }: MobileSidebarWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname?.includes('/sections/signin') || 
                    pathname?.includes('/sections/register') || 
                    pathname?.includes('/sections/reset-password');
  
  const toggleSidebar = () => setIsOpen(!isOpen);

  // If we're on an auth page, just render the children without sidebar
  if (isAuthPage) {
    return <div className="h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* 1. Mobile Burger Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 text-teal-700 bg-white rounded-full shadow-lg md:hidden transition-all duration-300 hover:bg-gray-100"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* 2. Slide-out Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-[240px] flex-shrink-0 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div onClick={() => setIsOpen(false)}>
            <DynamicSidebar /> 
        </div>
      </div>

      {/* 3. Static Desktop Sidebar */}
      <div className="hidden md:block w-[240px] flex-shrink-0">
        <DynamicSidebar />
      </div>

      {/* 4. Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        {children}
      </main>
    </div>
  );
}