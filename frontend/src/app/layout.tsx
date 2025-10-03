
import './globals.css'; 
import React from 'react';
import { MobileSidebarWrapper } from '@/components/MobileSidebarWrapper'; 

export const metadata = {
  title: 'Smart EdTech Dashboard',
  description: 'Personalized Learning Platform',
};

export default function RootLayout({ 
  children,
  params,
}: { 
  children: React.ReactNode,
  params?: any
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-foreground bg-background min-h-screen">
        <MobileSidebarWrapper>
          {children}
        </MobileSidebarWrapper>
      </body>
    </html>
  );
}