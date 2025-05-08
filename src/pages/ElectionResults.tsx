
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ElectionProps } from '@/components/elections/ElectionCard';
import { CandidateProps } from '@/components/candidates/CandidateCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface VoteCount {
  candidateId: string;
  count: number;
  percentage: number;
}

const ElectionResults = () => {
  const { id } = useParams<{ id: string }>();
  const [election, setElection] = useState<ElectionProps | null>(null);
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Try to load from Supabase first
      try {
        const session = (await supabase.auth.getSession()).data.session;
        if (session) {
          // If we have tables in Supabase, we could fetch from there
          // This will be a placeholder for now and will fall back to localStorage
          console.log("Supabase connected, but using localStorage for now");
        }
      } catch (error) {
        console.log("Failed to get Supabase session, using localStorage", error);
      }
      
      // Load election data from localStorage
      const storedElections = localStorage.getItem('elections');
      const storedCandidates = localStorage.getItem('candidates');
      const storedVotes = localStorage.getItem('votes');
      
      if (storedElections && id) {
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
            
            // Calculate vote counts
            if (storedVotes) {
              const votes = JSON.parse(storedVotes);
              const electionVotes = votes.filter((vote: any) => vote.electionId === id);
              
              // Total votes in this election
              const total = electionVotes.length;
              setTotalVotes(total);
              
              // Count votes for each candidate
              const counts: Record<string, number> = {};
              
              electionCandidates.forEach((candidate: CandidateProps) => {
                counts[candidate.id] = 0;
              });
              
              electionVotes.forEach((vote: any) => {
                if (counts[vote.candidateId] !== undefined) {
                  counts[vote.candidateId]++;
                }
              });
              
              // Calculate percentages and create vote count objects
              const voteCountsData = Object.entries(counts).map(([candidateId, count]) => ({
                candidateId,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0
              }));
              
              // Sort by votes (highest first)
              voteCountsData.sort((a, b) => b.count - a.count);
              
              setVoteCounts(voteCountsData);
            }
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
    };
    
    loadData();
  }, [id, navigate, toast]);
  
  // Get candidate by ID
  const getCandidate = (candidateId: string) => {
    return candidates.find(c => c.id === candidateId);
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <Link 
              to={`/elections/${id}`} 
              className="text-election-purple hover:underline flex items-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Election Details
            </Link>
            <h1 className="text-3xl font-bold">{election.title} - Results</h1>
            <div className="mt-2 flex items-center">
              <Badge className={`${getStatusColor(election.status)} capitalize`}>
                {election.status}
              </Badge>
              <span className="ml-4 text-sm text-gray-500">
                {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Election Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg font-medium">Total Votes Cast: <span className="text-election-purple">{totalVotes}</span></p>
            </div>
            
            {totalVotes > 0 ? (
              <div className="space-y-6">
                {voteCounts.map((voteCount, index) => {
                  const candidate = getCandidate(voteCount.candidateId);
                  if (!candidate) return null;
                  
                  return (
                    <div key={candidate.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-200 text-gray-800' : index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                          {index + 1}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                          <AvatarFallback className="bg-election-light-purple text-election-dark-purple">
                            {getInitials(candidate.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{candidate.name}</h3>
                            {index === 0 && election.status === 'completed' && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Winner
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{candidate.position} • {candidate.party}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="font-bold">{voteCount.percentage}%</p>
                          <p className="text-sm text-gray-500">{voteCount.count} votes</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={voteCount.percentage} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No votes have been cast in this election yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">About this Election</h2>
          <Card>
            <CardContent className="p-6">
              <p>{election.description}</p>
              
              <div className="mt-6 flex space-x-4">
                <Button asChild>
                  <Link to={`/elections/${election.id}`}>
                    Election Details
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/elections">
                    All Elections
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ElectionResults;
