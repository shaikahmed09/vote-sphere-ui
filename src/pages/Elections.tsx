
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ElectionCard, { ElectionProps } from '@/components/elections/ElectionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';

const mockElections: ElectionProps[] = [
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
    id: '2',
    title: 'Department Representative Election',
    description: 'Choose your department representatives who will voice your concerns to the faculty.',
    startDate: '2025-05-20',
    endDate: '2025-05-25',
    status: 'upcoming',
    candidateCount: 8,
  },
  {
    id: '3',
    title: 'Club Leadership Selection',
    description: 'Vote for the new leadership team for various clubs and societies on campus.',
    startDate: '2025-04-15',
    endDate: '2025-04-22',
    status: 'completed',
    candidateCount: 24,
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
  {
    id: '5',
    title: 'Campus Improvement Committee',
    description: 'Vote for students who will work with administration on campus improvement projects.',
    startDate: '2025-06-01',
    endDate: '2025-06-07',
    status: 'upcoming',
    candidateCount: 5,
  },
  {
    id: '6',
    title: 'Sports Council Elections',
    description: 'Choose representatives for different sports categories for the Sports Council.',
    startDate: '2025-04-01',
    endDate: '2025-04-10',
    status: 'completed',
    candidateCount: 15,
  },
  {
    id: '7',
    title: 'Academic Committee Selection',
    description: 'Select students who will represent peers in academic matters.',
    startDate: '2025-05-08',
    endDate: '2025-05-15',
    status: 'active',
    candidateCount: 10,
  },
  {
    id: '8',
    title: 'Residence Hall Representatives',
    description: 'Choose representatives for each residence hall to improve dorm life.',
    startDate: '2025-06-10',
    endDate: '2025-06-17',
    status: 'upcoming',
    candidateCount: 12,
  },
  {
    id: '9',
    title: 'Cultural Committee Elections',
    description: 'Select students who will organize cultural events throughout the year.',
    startDate: '2025-03-20',
    endDate: '2025-03-27',
    status: 'completed',
    candidateCount: 8,
  },
];

const Elections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const activeElections = mockElections.filter(e => e.status === 'active');
  const upcomingElections = mockElections.filter(e => e.status === 'upcoming');
  const completedElections = mockElections.filter(e => e.status === 'completed');

  const filteredActive = activeElections.filter(election => 
    election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUpcoming = upcomingElections.filter(election => 
    election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompleted = completedElections.filter(election => 
    election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Elections</h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-500">
            Browse all active, upcoming, and completed elections. Cast your vote and make a difference.
          </p>
        </div>
        
        <div className="mt-8 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search elections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="mt-8">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active ({filteredActive.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({filteredUpcoming.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filteredCompleted.length})</TabsTrigger>
            </TabsList>
            <div className="mt-8">
              <TabsContent value="active">
                {filteredActive.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredActive.map((election) => (
                      <ElectionCard key={election.id} {...election} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No active elections found.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="upcoming">
                {filteredUpcoming.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUpcoming.map((election) => (
                      <ElectionCard key={election.id} {...election} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No upcoming elections found.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed">
                {filteredCompleted.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCompleted.map((election) => (
                      <ElectionCard key={election.id} {...election} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No completed elections found.</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Elections;
