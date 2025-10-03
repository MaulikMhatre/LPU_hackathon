
// src/components/LogoutButton.tsx
"use client";

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { useRouter } from 'next/navigation';

const AUTH_COOKIE_NAME = 'mock_auth_token';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
        router.push('/sections/signin');
    };

    return (
        <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="w-full justify-start text-white 
                       bg-teal-300/20      
                       hover:bg-teal-600 
                       transition-colors p-3 h-auto rounded-lg shadow-md"
        >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm">Sign Out</span>
        </Button>
    );
}
