
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export interface ElectionProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  candidateCount: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const ElectionCard: React.FC<ElectionProps> = ({
  id,
  title,
  description,
  startDate,
  endDate,
  status,
  candidateCount,
}) => {
  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="election-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge className={`${getStatusColor(status)} capitalize`}>
            {status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-500 mt-1">
          {formattedStartDate} - {formattedEndDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-gray-700 text-sm">{description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{candidateCount} {candidateCount === 1 ? 'Candidate' : 'Candidates'}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90">
          <Link to={`/elections/${id}`}>
            {status === 'active' 
              ? 'Vote Now' 
              : status === 'completed' 
                ? 'View Results' 
                : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
