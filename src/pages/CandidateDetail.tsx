
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { CandidateProps } from '@/components/candidates/CandidateCard';
import { ElectionProps } from '@/components/elections/ElectionCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const electionId = searchParams.get('election');
  
  const [candidate, setCandidate] = useState<CandidateProps | null>(null);
  const [election, setElection] = useState<ElectionProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVoted, setUserVoted] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load candidate data
    const storedCandidates = localStorage.getItem('candidates');
    if (storedCandidates && id) {
      const candidates = JSON.parse(storedCandidates);
      const foundCandidate = candidates.find((c: CandidateProps) => c.id === id);
      
      if (foundCandidate) {
        setCandidate(foundCandidate);
        
        // Load election data
        const storedElections = localStorage.getItem('elections');
        if (storedElections) {
          const elections = JSON.parse(storedElections);
          const foundElection = elections.find((e: ElectionProps) => e.id === foundCandidate.electionId);
          
          if (foundElection) {
            setElection(foundElection);
          }
        }
        
        // Check if user has voted in this election
        const currentUser = localStorage.getItem('currentUser');
        const storedVotes = localStorage.getItem('votes');
        
        if (storedVotes && currentUser) {
          const votes = JSON.parse(storedVotes);
          const user = JSON.parse(currentUser);
          
          const hasVoted = votes.some((vote: any) => 
            vote.electionId === foundCandidate.electionId && vote.userId === user.id
          );
          
          setUserVoted(hasVoted);
        }
      } else {
        // Candidate not found
        toast({
          title: "Candidate Not Found",
          description: "The requested candidate could not be found.",
          variant: "destructive",
        });
        navigate('/candidates');
      }
    }
    
    setIsLoading(false);
  }, [id, electionId, navigate, toast]);
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  const handleVoteClick = () => {
    if (!candidate || !election) return;
    
    if (election.status !== 'active') {
      toast({
        title: "Voting Unavailable",
        description: `This election is ${election.status}. Voting is only available for active elections.`,
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to election page to vote
    navigate(`/elections/${election.id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-election-purple border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!candidate || !election) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold">Candidate not found</h2>
          <p className="mt-4">The candidate you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-6">
            <Link to="/candidates">Back to Candidates</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/candidates" 
          className="text-election-purple hover:underline flex items-center mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Candidates
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="text-center p-6">
              <Avatar className="h-32 w-32 mx-auto">
                <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                <AvatarFallback className="text-2xl bg-election-light-purple text-election-dark-purple">
                  {getInitials(candidate.name)}
                </AvatarFallback>
              </Avatar>
              
              <h1 className="mt-4 text-2xl font-bold">{candidate.name}</h1>
              <p className="text-gray-500">{candidate.position}</p>
              
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-election-light-purple text-election-dark-purple">
                  {candidate.party}
                </span>
              </div>
              
              <blockquote className="italic text-gray-600 mt-6 border-l-4 border-election-light-purple pl-4 py-2 text-left">
                "{candidate.slogan}"
              </blockquote>
              
              <div className="mt-6">
                <Link to={`/elections/${election.id}`} className="text-election-purple hover:underline block mb-2">
                  {election.title}
                </Link>
                
                {election.status === 'active' && !userVoted && (
                  <Button 
                    className="w-full mt-2 bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
                    onClick={handleVoteClick}
                  >
                    Vote in this Election
                  </Button>
                )}
                
                {election.status === 'completed' && (
                  <Button 
                    asChild
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <Link to={`/elections/${election.id}/results`}>
                      View Election Results
                    </Link>
                  </Button>
                )}
                
                {userVoted && (
                  <div className="mt-4 text-sm text-green-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    You've already voted
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">About the Candidate</h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-4">
                  This candidate is running for the position of {candidate.position} in the {election.title}.
                </p>
                <p className="mb-4">
                  Platform and details about this candidate will be displayed here. Currently, the system 
                  stores basic candidate information. In a future update, more detailed candidate profiles 
                  can be added.
                </p>
                <p>
                  Election Status: <span className="font-medium capitalize">{election.status}</span>
                </p>
                <p className="mt-2">
                  Election Period: {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Election Information</h2>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-2">{election.title}</h3>
                <p className="text-gray-700 mb-4">{election.description}</p>
                <Button asChild className="mt-2">
                  <Link to={`/elections/${election.id}`}>
                    View Election Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateDetail;
