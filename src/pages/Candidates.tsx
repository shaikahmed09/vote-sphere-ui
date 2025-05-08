
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { CandidateProps } from '@/components/candidates/CandidateCard';
import { ElectionProps } from '@/components/elections/ElectionCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Candidates = () => {
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [elections, setElections] = useState<ElectionProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterElection, setFilterElection] = useState('all');
  
  useEffect(() => {
    // Load candidates from localStorage
    const storedCandidates = localStorage.getItem('candidates');
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    }
    
    // Load elections for filter dropdown
    const storedElections = localStorage.getItem('elections');
    if (storedElections) {
      setElections(JSON.parse(storedElections));
    }
  }, []);

  // Get election title by ID
  const getElectionTitle = (electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    return election ? election.title : 'Unknown Election';
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  // Filter candidates based on search and election filter
  const filteredCandidates = candidates.filter(candidate => 
    (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidate.party.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterElection === 'all' || candidate.electionId === filterElection)
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Candidates</h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-500">
            Meet the candidates running in current and upcoming elections.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Input
              type="text"
              placeholder="Search candidates by name, position, or party..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/3">
            <Select value={filterElection} onValueChange={setFilterElection}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by election" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Elections</SelectItem>
                {elections.map(election => (
                  <SelectItem key={election.id} value={election.id}>
                    {election.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-8">
          {filteredCandidates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden">
                  <CardHeader className="flex flex-col items-center pb-2 pt-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                      <AvatarFallback className="text-lg bg-election-light-purple text-election-dark-purple">
                        {getInitials(candidate.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-3 text-center">
                      <h3 className="font-medium text-lg">{candidate.name}</h3>
                      <p className="text-sm text-gray-500">{candidate.position}</p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-election-light-purple text-election-dark-purple">
                          {candidate.party}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {getElectionTitle(candidate.electionId)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 pb-6">
                    <blockquote className="italic text-sm text-gray-600 text-center mb-4">
                      "{candidate.slogan}"
                    </blockquote>
                    <Button asChild variant="outline" className="w-full border-election-purple text-election-purple hover:bg-election-light-purple/20">
                      <Link to={`/candidates/${candidate.id}?election=${candidate.electionId}`}>
                        View Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No candidates found matching your criteria.</p>
              {searchTerm || filterElection !== 'all' ? (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterElection('all');
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              ) : (
                <p className="text-gray-500 mt-2">No candidates have been added yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Candidates;
