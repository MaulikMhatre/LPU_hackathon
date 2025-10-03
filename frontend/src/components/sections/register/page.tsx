// src/app/sections/register/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, CheckCircle, ArrowLeft, Loader, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from "@/lib/api";

// Utility component to display password strength rules
const PasswordRule: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <span className={`flex items-center text-xs font-medium transition-colors ${isValid ? 'text-teal-600' : 'text-muted-foreground'}`}>
        <CheckCircle className={`w-3 h-3 mr-1 ${isValid ? 'text-teal-500' : 'text-gray-400'}`} />
        {text}
    </span>
);

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Password validation logic
    const hasMinLength = password.length >= 6;
    const hasCapital = /[A-Z]/.test(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;
    const isFormValid = hasMinLength && hasCapital && passwordsMatch && name && email;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!isFormValid) {
            setError("Please ensure all required fields are filled and password rules are met.");
            setIsLoading(false);
            return;
        }

        try {
            // Call the register API
            await authAPI.register({
                name,
                email,
                password,
                role: 'student' // Default role
            });
            
            // Registration successful
            setIsRegistered(true);
            
            // Redirect to login after a short delay
            setTimeout(() => {
                router.push('/sections/signin');
            }, 2000);
        } catch (err) {
            setError("Registration failed: Email address is already in use or server error.");
            setIsLoading(false);
            return;
        }
    };

    if (isRegistered) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
                <div className="w-full max-w-[400px] text-center">
                    <div className="flex justify-center mb-8">
                        <Image
                            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/13932a58-02b8-4c3f-9a9d-e87d3ca9caa8-arihant-classmatrix-org/assets/images/logo-big-blue-1.png?"
                            alt="Class Matrix Logo"
                            width={180}
                            height={60}
                        />
                    </div>
                    <div className="bg-card rounded-lg shadow-xl p-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Registration Successful!</h2>
                        <p className="text-muted-foreground mb-6">Your account has been created. Redirecting you to login...</p>
                        <div className="animate-pulse">
                            <Loader className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
            <div className="w-full max-w-[450px]">
                <div className="flex justify-center mb-8">
                    <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/13932a58-02b8-4c3f-9a9d-e87d3ca9caa8-arihant-classmatrix-org/assets/images/logo-big-blue-1.png?"
                        alt="Class Matrix Logo"
                        width={180}
                        height={60}
                    />
                </div>

                <h1 className="text-center text-[28px] font-normal text-gray-500 mb-6">
                    Create Account
                </h1>

                <div className="bg-card rounded-lg shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="name" className="text-accent font-medium text-base">
                                Full Name
                            </Label>
                            <div className="mt-1 relative">
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-2 h-[49px] border-border focus:ring-ring"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-accent font-medium text-base">
                                Email Address
                            </Label>
                            <div className="mt-1 relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 h-[49px] border-border focus:ring-ring"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password" className="text-accent font-medium text-base">
                                Password
                            </Label>
                            <div className="mt-1 relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a secure password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 h-[49px] border-border focus:ring-ring"
                                    required
                                />
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <PasswordRule isValid={hasMinLength} text="At least 6 characters" />
                                <PasswordRule isValid={hasCapital} text="At least 1 capital letter" />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label htmlFor="confirmPassword" className="text-accent font-medium text-base">
                                Confirm Password
                            </Label>
                            <div className="mt-1 relative">
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`mt-2 h-[49px] border-border focus:ring-ring ${!passwordsMatch && confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    required
                                />
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="mt-6 bg-[#3E7A8C] hover:bg-[#3E7A8C]/90 text-primary-foreground py-2.5 px-8 h-auto font-semibold w-full"
                        >
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </Button>
                    </form>
                </div>
                
                {/* Sign In Link */}
                <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? 
                        <Link href="/sections/signin" className="text-[#3E7A8C] hover:text-[#3E7A8C]/80 font-semibold ml-1 hover:underline">
                            Sign In
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