
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ElectionCard, { ElectionProps } from '@/components/elections/ElectionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Elections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [elections, setElections] = useState<ElectionProps[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load elections from localStorage
    const storedElections = localStorage.getItem('elections');
    if (storedElections) {
      const parsedElections = JSON.parse(storedElections);
      
      // Update status based on dates
      const now = new Date();
      const updatedElections = parsedElections.map((election: ElectionProps) => {
        const startDate = new Date(election.startDate);
        const endDate = new Date(election.endDate);
        
        let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
        if (now > endDate) {
          status = 'completed';
        } else if (now >= startDate && now <= endDate) {
          status = 'active';
        }
        
        return {
          ...election,
          status
        };
      });
      
      setElections(updatedElections);
      localStorage.setItem('elections', JSON.stringify(updatedElections));
    } else {
      setElections([]);
    }
  }, []);

  // Check if user is logged in and verified
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to view and participate in elections.",
      });
      navigate('/login');
    } else {
      const user = JSON.parse(currentUser);
      if (!user.verified) {
        toast({
          title: "Account Not Verified",
          description: "Your account is pending verification. You can view elections but cannot vote until verified.",
        });
      }
    }
  }, [navigate, toast]);
  
  const activeElections = elections.filter(e => e.status === 'active');
  const upcomingElections = elections.filter(e => e.status === 'upcoming');
  const completedElections = elections.filter(e => e.status === 'completed');

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
