
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ElectionProps } from '@/components/elections/ElectionCard';
import { CandidateProps } from '@/components/candidates/CandidateCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CandidateList from '@/components/candidates/CandidateList';

const ElectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<ElectionProps | null>(null);
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userVoted, setUserVoted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to view election details.",
      });
      navigate('/login');
      return;
    }

    // Load election data
    setIsLoading(true);
    const storedElections = localStorage.getItem('elections');
    const storedCandidates = localStorage.getItem('candidates');
    const storedVotes = localStorage.getItem('votes');
    
    if (storedElections) {
      const elections = JSON.parse(storedElections);
      const foundElection = elections.find((e: ElectionProps) => e.id === id);
      
      if (foundElection) {
        setElection(foundElection);
        
        // Load candidates for this election
        if (storedCandidates) {
          const allCandidates = JSON.parse(storedCandidates);
          const electionCandidates = allCandidates.filter(
            (c: CandidateProps) => c.electionId === id
          );
          setCandidates(electionCandidates);
        }
        
        // Check if user has voted in this election
        if (storedVotes && currentUser) {
          const votes = JSON.parse(storedVotes);
          const user = JSON.parse(currentUser);
          
          const hasVoted = votes.some((vote: any) => 
            vote.electionId === id && vote.userId === user.id
          );
          
          setUserVoted(hasVoted);
        }
      } else {
        // Election not found
        toast({
          title: "Election Not Found",
          description: "The requested election could not be found.",
          variant: "destructive",
        });
        navigate('/elections');
      }
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-election-purple border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!election) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold">Election not found</h2>
          <p className="mt-4">The election you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-6">
            <Link to="/elections">Back to Elections</Link>
          </Button>
        </div>
      </Layout>
    );
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

  const formattedStartDate = new Date(election.startDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedEndDate = new Date(election.endDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <Link 
              to="/elections" 
              className="text-election-purple hover:underline flex items-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Elections
            </Link>
            <h1 className="text-3xl font-bold">{election.title}</h1>
            <div className="mt-2 flex items-center">
              <Badge className={`${getStatusColor(election.status)} capitalize`}>
                {election.status}
              </Badge>
              <span className="ml-4 text-sm text-gray-500">
                {formattedStartDate} - {formattedEndDate}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">About this Election</h2>
          <p className="text-gray-700">{election.description}</p>
        </div>

        {election.status === 'active' && !userVoted && (
          <Card className="mb-8 bg-election-light-purple/20 border-election-light-purple">
            <CardHeader className="pb-3">
              <h2 className="text-xl font-semibold">Ready to Vote?</h2>
            </CardHeader>
            <CardContent>
              <p>This election is currently active. Review the candidates below and cast your vote.</p>
            </CardContent>
          </Card>
        )}

        {election.status === 'active' && userVoted && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <h2 className="text-xl font-semibold text-green-700">You've Voted!</h2>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">Thank you for participating in this election. Your vote has been recorded.</p>
            </CardContent>
          </Card>
        )}

        <h2 className="text-2xl font-semibold mb-6">Candidates</h2>
        {candidates.length > 0 ? (
          <CandidateList 
            candidates={candidates} 
            electionStatus={election.status}
            electionId={election.id}
            userVoted={userVoted}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No candidates have been added to this election yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ElectionDetail;
