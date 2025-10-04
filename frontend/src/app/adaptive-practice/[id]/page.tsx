// "use client";

// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// interface AdaptivePractice {
//   id: number;
//   title: string;
//   description: string;
//   subject: string;
//   performance_level: string;
//   content: string;
//   resources: string;
//   completed: boolean;
//   created_at: string;
// }

// export default function AdaptivePracticeDetail({ params }: { params: { id: string } }) {
//   const [practice, setPractice] = useState<AdaptivePractice | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const router = useRouter();

//   const fetchPractice = async () => {
//     setLoading(true);
//     try {
//       // Use mock data for development
//       setPractice({
//         id: parseInt(params.id),
//         title: "Advanced Mathematical Problem Solving",
//         description: "Challenge yourself with complex mathematical problems requiring creative approaches and deep conceptual understanding.",
//         subject: "Mathematics",
//         performance_level: "advanced",
//         content: `# Advanced Mathematical Problem Solving

// This practice session focuses on developing sophisticated problem-solving skills and mathematical thinking.

// ## Key Concepts to Master:
// 1. Multi-step problem solving and proof techniques
// 2. Mathematical modeling of complex situations
// 3. Connections between different mathematical domains
// 4. Abstract reasoning and generalization
// 5. Mathematical communication and justification

// ## Challenge Problems:
// 1. Prove that the sum of the first n positive integers is n(n+1)/2 using mathematical induction.

// 2. A cylindrical water tank with radius 4 meters and height 10 meters is being filled at a rate of 2 cubic meters per minute. At what rate (in meters per minute) is the height of the water increasing when the tank is half full?

// 3. Find all values of x that satisfy the equation: log₂(x²-7x+12) = 3

// 4. A game involves rolling two fair six-sided dice. If the sum is 7 or 11, you win $10. If the sum is 2, 3, or 12, you lose $5. For any other sum, you lose $1. What is the expected value of this game? Is it fair?

// 5. Prove that for any positive integer n, the number n³ - n is divisible by 6.`,
//         resources: JSON.stringify([
//           { title: 'MIT OpenCourseWare - Mathematics', url: 'https://ocw.mit.edu/courses/mathematics/' },
//           { title: 'Brilliant.org - Problem Solving', url: 'https://brilliant.org/courses/problem-solving/' },
//           { title: '3Blue1Brown - Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra' }
//         ]),
//         completed: false,
//         created_at: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error("Error fetching adaptive practice:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsCompleted = async () => {
//     if (!practice) return;
    
//     setUpdating(true);
//     try {
//       const response = await fetch(`/api/adaptive-practice/${params.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           completed: true
//         }),
//       });

//       if (response.ok) {
//         const updatedPractice = await response.json();
//         setPractice(updatedPractice);
//       }
//     } catch (error) {
//       console.error("Error updating practice:", error);
//       // Update locally if API fails
//       setPractice(prev => prev ? {...prev, completed: true} : null);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   useEffect(() => {
//     fetchPractice();
//   }, [params.id]);

//   const getLevelColor = (level: string) => {
//     switch (level?.toLowerCase()) {
//       case 'remedial':
//         return 'bg-amber-100 text-amber-800 border-amber-200';
//       case 'standard':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'advanced':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const parseResources = (resourcesString: string) => {
//     try {
//       return JSON.parse(resourcesString);
//     } catch (e) {
//       return [];
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!practice) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Practice not found</h1>
//           <Link href="/adaptive-practice" passHref>
//             <Button>
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Practices
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="mb-6">
//         <Link href="/adaptive-practice" passHref>
//           <Button variant="outline" size="sm">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Practices
//           </Button>
//         </Link>
//       </div>

//       <div className="flex flex-col space-y-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-3xl font-bold">{practice.title}</h1>
//               <Badge className={`${getLevelColor(practice.performance_level)}`}>
//                 {practice.performance_level.charAt(0).toUpperCase() + practice.performance_level.slice(1)}
//               </Badge>
//             </div>
//             <p className="text-gray-500 mt-1">{practice.subject}</p>
//           </div>
          
//           {!practice.completed ? (
//             <Button onClick={markAsCompleted} disabled={updating}>
//               {updating ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="mr-2 h-4 w-4" />
//                   Mark as Completed
//                 </>
//               )}
//             </Button>
//           ) : (
//             <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
//               <CheckCircle className="mr-2 h-4 w-4" />
//               Completed
//             </Badge>
//           )}
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Description</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>{practice.description}</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Practice Content</CardTitle>
//           </CardHeader>
//           <CardContent className="prose max-w-none dark:prose-invert">
//             <div dangerouslySetInnerHTML={{ __html: practice.content.replace(/\n/g, '<br>') }} />
//           </CardContent>
//         </Card>

//         {practice.resources && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Additional Resources</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2">
//                 {parseResources(practice.resources).map((resource: any, index: number) => (
//                   <li key={index}>
//                     <a 
//                       href={resource.url} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       {resource.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
