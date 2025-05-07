
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

export interface CandidateProps {
  id: string;
  name: string;
  position: string;
  party: string;
  imageUrl?: string;
  slogan: string;
  electionId: string;
}

const CandidateCard: React.FC<CandidateProps> = ({
  id,
  name,
  position,
  party,
  imageUrl,
  slogan,
  electionId,
}) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="candidate-card h-full flex flex-col">
      <CardHeader className="flex flex-col items-center pb-2">
        <Avatar className="h-24 w-24">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="text-lg bg-election-light-purple text-election-dark-purple">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="mt-3 text-center">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-gray-500">{position}</p>
          <div className="mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-election-light-purple text-election-dark-purple">
              {party}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <blockquote className="italic text-sm text-gray-600 text-center">
          "{slogan}"
        </blockquote>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full border-election-purple text-election-purple hover:bg-election-light-purple/20">
          <Link to={`/candidates/${id}?election=${electionId}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
