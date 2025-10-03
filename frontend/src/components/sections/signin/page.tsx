
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AUTH_COOKIE_NAME = 'mock_auth_token';
const MOCK_SESSION_TOKEN = 'valid_user_session_token_123'; 

export default function SignInForm() { 
    const [loginType, setLoginType] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authAPI.login({ email, password });
            
            // Store user data and token
            localStorage.setItem('user', JSON.stringify(response.user));
            document.cookie = `${AUTH_COOKIE_NAME}=${response.user.id}; Path=/; Max-Age=3600; SameSite=Lax`;

            const params = new URLSearchParams(window.location.search);
            const redirectTo = params.get('redirect') || '/';

            router.push(redirectTo); 

        } catch (e) {
            setError(e.message || "Invalid credentials or an unexpected sign-in error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
            <div className="w-full max-w-[400px]">
                <div className="flex justify-center mb-8">
                    <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/13932a58-02b8-4c3f-9a9d-e87d3ca9caa8-arihant-classmatrix-org/assets/images/logo-big-blue-1.png?"
                        alt="Class Matrix Logo"
                        width={180}
                        height={60}
                    />
                </div>

                <h1 className="text-center text-[28px] font-normal text-gray-500 mb-6">
                    Welcome Back
                </h1>

                <div className="bg-card rounded-lg shadow-xl p-11">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Login Type Select */}
                            <div>
                                <Label htmlFor="login-type" className="text-accent font-medium text-base">Login Type</Label>
                                <Select defaultValue="student" onValueChange={setLoginType}>
                                    <SelectTrigger id="login-type" className="mt-2 h-[51px] border-border focus:ring-ring">
                                        <SelectValue placeholder="Select login type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="professor">Professor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Email Input */}
                            <div>
                                <Label htmlFor="email" className="text-accent font-medium text-base">Email Address</Label>
                                <Input id="email" type="email" placeholder="Enter User Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-[49px] border-border focus:ring-ring" />
                            </div>

                            {/* Password Input */}
                            <div>
                                <Label htmlFor="password" className="text-accent font-medium text-base">Password</Label>
                                <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-[49px] border-border focus:ring-ring" />
                            </div>
                        </div>
                        
                        {/* Error Message */}
                        {error && (
                            <p className="mt-4 text-sm font-medium text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 bg-[#3E7A8C] hover:bg-[#3E7A8C]/90 text-primary-foreground py-2.5 px-8 h-auto font-semibold w-full"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        
                        {/* Forgot Password Link */}
                        <div className="mt-4 text-center">
                            <Link href="/sections/reset-password" className="text-sm text-accent hover:underline">
                                Forgot/Reset Password
                            </Link>
                        </div>
                        
                    </form>
                </div>
                
                {/* 🔑 NEW: Register Prompt */}
                <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account? 
                        <Link href="/sections/register" className="text-[#3E7A8C] hover:text-[#3E7A8C]/80 font-semibold ml-1 hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>


                <div className="text-center mt-8 space-y-1 text-xs text-muted-foreground">
                    <p>Protected by reCAPTCHA. <Link href="#" className="text-accent hover:underline">Privacy Policy</Link></p>
                </div>
            </div>
        </main>
    );
}