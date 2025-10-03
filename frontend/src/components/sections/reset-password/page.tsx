"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordForm() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Call the reset password API
            await authAPI.resetPassword({ email });
            setSuccess(true);
        } catch (e) {
            setError(e.message || "Failed to send reset password email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
                <div className="w-full max-w-[400px] text-center">
                    <div className="flex justify-center mb-8">
                        <Image
                            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/13932a58-02b8-4c3f-9a9d-e87d3ca9caa8-arihant-classmatrix-org/assets/images/logo-big-blue-1.png?"
                            alt="Class Matrix Logo"
                            width={180}
                            height={60}
                        />
                    </div>
                    <div className="bg-card rounded-lg shadow-xl p-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Check Your Email</h2>
                        <p className="text-muted-foreground mb-6">
                            We've sent password reset instructions to <strong>{email}</strong>. 
                            Please check your inbox and follow the link to reset your password.
                        </p>
                        <Button
                            onClick={() => router.push('/sections/signin')}
                            className="bg-[#3E7A8C] hover:bg-[#3E7A8C]/90 text-primary-foreground py-2.5 px-8 h-auto font-semibold w-full"
                        >
                            Return to Sign In
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

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
                    Reset Password
                </h1>

                <div className="bg-card rounded-lg shadow-xl p-8">
                    <p className="text-muted-foreground mb-6">
                        Enter your email address below and we'll send you instructions to reset your password.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <Label htmlFor="email" className="text-accent font-medium text-base">Email Address</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="mt-2 h-[49px] border-border focus:ring-ring" 
                                    required
                                />
                            </div>
                        </div>
                        
                        {/* Error Message */}
                        {error && (
                            <p className="mt-4 text-sm font-medium text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || !email}
                            className="mt-6 bg-[#3E7A8C] hover:bg-[#3E7A8C]/90 text-primary-foreground py-2.5 px-8 h-auto font-semibold w-full"
                        >
                            {isLoading ? 'Sending...' : 'Reset Password'}
                        </Button>
                    </form>
                </div>
                
                {/* Back to Sign In */}
                <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                        Remember your password? 
                        <Link href="/sections/signin" className="text-[#3E7A8C] hover:text-[#3E7A8C]/80 font-semibold ml-1 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}