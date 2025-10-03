"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { mockSignIn } from "@/lib/firebase_auth"; // Import your authentication logic
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

export default function SignInPage() {
  const [loginType, setLoginType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for handling errors
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Initialize the router hook
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // In a real application, you would pass loginType, email, and password to your server/Firebase function
    console.log(`Attempting sign-in for ${loginType}: ${email}`);

    try {
      // Attempt to sign the user in
      const userData = await mockSignIn(email, password, loginType); 
      
      console.log("Sign-in successful for:", userData.username);

      // SUCCESS: Redirect to the main dashboard page
      router.push('/'); 

    } catch (err) {
      //  ERROR: Show error message
      setError(e.message || "An unexpected sign-in error occurred.");
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
          Sign In
        </h1>

        <div className="bg-card rounded-lg shadow-xl p-11">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="login-type" className="text-accent font-medium text-base">
                  Login Type
                </Label>
                <Select defaultValue="student" onValueChange={setLoginType}>
                  <SelectTrigger id="login-type" className="mt-2 h-[51px] border-border focus:ring-ring">
                    <SelectValue placeholder="Select login type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="paper-corrector">Paper Corrector</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email" className="text-accent font-medium text-base">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter User Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-[49px] border-border focus:ring-ring"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-accent font-medium text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-[49px] border-border focus:ring-ring"
                />
              </div>
            </div>
            
            {/* Display Error Message */}
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
            
            <div className="mt-4">
              <a href="#" className="text-sm text-accent hover:underline">
                Forgot/Reset Password
              </a>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
            </div>

            <div className="mt-6">
              <a href="#">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/13932a58-02b8-4c3f-9a9d-e87d3ca9caa8-arihant-classmatrix-org/assets/images/google-sso-3.png?"
                  alt="Sign in with Google"
                  width={406}
                  height={67}
                  className="w-full h-auto"
                />
              </a>
            </div>
            
          </form>
        </div>

        <div className="text-center mt-8 space-y-1 text-xs text-muted-foreground">
          <p>
            <a href="#" className="text-accent hover:underline">Privacy Policy</a>
          </p>
          <p>Protected by reCAPTCHA.</p>
        </div>
      </div>
    </main>
  );
}
