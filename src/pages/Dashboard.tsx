
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ElectionCard, { ElectionProps } from '@/components/elections/ElectionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [activeElections, setActiveElections] = useState<ElectionProps[]>([]);
  const [userVoteHistory, setUserVoteHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userVerified, setUserVerified] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your dashboard.",
      });
      navigate('/login');
      return;
    }

    // Load user data
    const user = JSON.parse(currentUser);
    setUserVerified(user.verified || false);

    // Load elections from localStorage
    const storedElections = localStorage.getItem('elections');
    if (storedElections) {
      const allElections = JSON.parse(storedElections);
      // Filter active elections
      const active = allElections.filter((e: ElectionProps) => e.status === 'active');
      setActiveElections(active);
    }

    // Load user votes
    const storedVotes = localStorage.getItem('votes');
    if (storedVotes && user.id) {
      const allVotes = JSON.parse(storedVotes);
      // Filter votes by this user
      const userVotes = allVotes.filter((vote: any) => vote.userId === user.id);
      
      // Get election and candidate details for each vote
      const voteHistory: any[] = [];
      
      userVotes.forEach((vote: any) => {
        // Get election details
        let electionTitle = "";
        let candidateName = "";
        
        if (storedElections) {
          const allElections = JSON.parse(storedElections);
          const election = allElections.find((e: ElectionProps) => e.id === vote.electionId);
          if (election) {
            electionTitle = election.title;
          }
        }
        
        // Get candidate details
        const storedCandidates = localStorage.getItem('candidates');
        if (storedCandidates) {
          const allCandidates = JSON.parse(storedCandidates);
          const candidate = allCandidates.find((c: any) => c.id === vote.candidateId);
          if (candidate) {
            candidateName = `${candidate.name} - ${candidate.position}`;
          }
        }
        
        voteHistory.push({
          electionId: vote.electionId,
          electionTitle,
          votedFor: candidateName,
          date: new Date(vote.timestamp).toISOString().split('T')[0]
        });
      });
      
      setUserVoteHistory(voteHistory);
    }

    setIsLoading(false);
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-election-purple border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, Student!</p>
          </div>
          <Button asChild className="mt-4 md:mt-0 bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90">
            <Link to="/elections">
              View All Elections
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeElections.length}</div>
              <p className="text-sm text-gray-500 mt-1">Elections you can vote in now</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Your Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userVoteHistory.length}</div>
              <p className="text-sm text-gray-500 mt-1">Elections you've participated in</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-medium flex items-center ${userVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  {userVerified ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  )}
                </svg>
                {userVerified ? 'Verified' : 'Pending Verification'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {userVerified 
                  ? 'Your account is in good standing' 
                  : 'Your account is waiting for admin approval'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Elections You Can Vote In</h2>
          {activeElections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeElections.map((election) => (
                <ElectionCard key={election.id} {...election} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">There are no active elections at the moment.</p>
                <p className="text-gray-500 mt-1">Check back soon for upcoming elections!</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Voting History</h2>
          {userVoteHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Election
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voted For
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userVoteHistory.map((vote, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vote.electionTitle || "Unknown Election"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vote.votedFor || "Unknown Candidate"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(vote.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link to={`/elections/${vote.electionId}`} className="text-election-purple hover:underline">
                          View Results
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">You haven't voted in any elections yet.</p>
                <p className="text-gray-500 mt-1">Participate in active elections to see your voting history!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
