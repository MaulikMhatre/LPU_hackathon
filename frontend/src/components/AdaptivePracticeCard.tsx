"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface AdaptivePracticeCardProps {
  id: number;
  title: string;
  description: string;
  subject: string;
  performanceLevel: string;
  completed: boolean;
  createdAt: string;
}

const AdaptivePracticeCard: React.FC<AdaptivePracticeCardProps> = ({
  id,
  title,
  description,
  subject,
  performanceLevel,
  completed,
  createdAt,
}) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'remedial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'standard':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge className={`${getLevelColor(performanceLevel)}`}>
            {performanceLevel.charAt(0).toUpperCase() + performanceLevel.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-500">
          {subject} • {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center">
          {completed ? (
            <span className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" /> Completed
            </span>
          ) : (
            <span className="flex items-center text-blue-600 text-sm">
              <Clock className="h-4 w-4 mr-1" /> In Progress
            </span>
          )}
        </div>
        <Link href={`/adaptive-practice/${id}`} passHref>
          <Button variant="outline" size="sm">
            View Practice
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AdaptivePracticeCard;