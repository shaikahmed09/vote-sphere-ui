
import React from 'react';
import Layout from '@/components/layout/Layout';
import ElectionCard, { ElectionProps } from '@/components/elections/ElectionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const mockActiveElections: ElectionProps[] = [
  {
    id: '1',
    title: 'Student Council Elections',
    description: 'Vote for your representatives in the Student Council for the academic year 2025-2026.',
    startDate: '2025-05-10',
    endDate: '2025-05-17',
    status: 'active',
    candidateCount: 12,
  },
  {
    id: '4',
    title: 'Student Union Board Elections',
    description: 'Select members who will manage student union affairs and budget.',
    startDate: '2025-05-12',
    endDate: '2025-05-19',
    status: 'active',
    candidateCount: 6,
  },
];

const Dashboard = () => {
  const userVoteHistory = [
    {
      electionId: '3',
      electionTitle: 'Club Leadership Selection',
      votedFor: 'John Doe - President',
      date: '2025-04-18',
    },
    {
      electionId: '6',
      electionTitle: 'Sports Council Elections',
      votedFor: 'Jane Smith - Basketball Representative',
      date: '2025-04-05',
    },
    {
      electionId: '9',
      electionTitle: 'Cultural Committee Elections',
      votedFor: 'Michael Johnson - Drama Club Representative',
      date: '2025-03-22',
    },
  ];

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
              <div className="text-3xl font-bold">{mockActiveElections.length}</div>
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
              <div className="text-lg font-medium text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
              <p className="text-sm text-gray-500 mt-1">Your account is in good standing</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Elections You Can Vote In</h2>
          {mockActiveElections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockActiveElections.map((election) => (
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
                        {vote.electionTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vote.votedFor}
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
