
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateProps } from './CandidateCard';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface CandidateListProps {
  candidates: CandidateProps[];
  electionStatus: string;
  electionId: string;
  userVoted: boolean;
}

interface VoteData {
  id: string;
  userId: string;
  electionId: string;
  candidateId: string;
  timestamp: string;
}

const CandidateList: React.FC<CandidateListProps> = ({ 
  candidates, 
  electionStatus,
  electionId,
  userVoted 
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleVoteClick = (candidate: CandidateProps) => {
    // Ensure user is logged in and verified
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to vote in this election.",
      });
      navigate('/login');
      return;
    }

    const user = JSON.parse(currentUser);
    if (!user.verified) {
      toast({
        title: "Account Not Verified",
        description: "Your account needs to be verified by an administrator before you can vote.",
        variant: "destructive",
      });
      return;
    }

    // Set selected candidate and open confirmation dialog
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Create vote record
      const newVote: VoteData = {
        id: `vote-${Date.now()}`,
        userId: currentUser.id,
        electionId: electionId,
        candidateId: selectedCandidate.id,
        timestamp: new Date().toISOString(),
      };
      
      // Store vote in localStorage
      const storedVotes = localStorage.getItem('votes');
      const votes = storedVotes ? JSON.parse(storedVotes) : [];
      votes.push(newVote);
      localStorage.setItem('votes', JSON.stringify(votes));
      
      // Also try to store it in Supabase if connected
      try {
        const user = (await supabase.auth.getSession()).data.session?.user;
        if (user) {
          console.log("Attempting to save vote to Supabase");
          // This is commented out until we create the votes table in Supabase
          // const { error } = await supabase.from('votes').insert({
          //   election_id: electionId,
          //   candidate_id: selectedCandidate.id,
          //   user_id: user.id,
          //   created_at: new Date().toISOString()
          // });
          // if (error) throw error;
        }
      } catch (error) {
        console.log("Failed to save to Supabase, using localStorage only", error);
      }
      
      // Show success message
      toast({
        title: "Vote Recorded",
        description: `You have successfully voted for ${selectedCandidate.name}.`,
      });
      
      // Close dialog and refresh page
      setIsDialogOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Voting error:', error);
      toast({
        title: "Voting Failed",
        description: "An error occurred while recording your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="h-full flex flex-col">
            <CardHeader className="flex flex-col items-center pb-2">
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
              </div>
            </CardHeader>
            <CardContent className="py-2 flex-grow">
              <blockquote className="italic text-sm text-gray-600 text-center">
                "{candidate.slogan}"
              </blockquote>
            </CardContent>
            <CardFooter className="pt-2">
              {electionStatus === 'active' && !userVoted ? (
                <Button 
                  className="w-full bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
                  onClick={() => handleVoteClick(candidate)}
                >
                  Vote for this Candidate
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full border-election-purple text-election-purple hover:bg-election-light-purple/20"
                  disabled={electionStatus === 'upcoming'}
                >
                  {electionStatus === 'upcoming' ? 'Voting Not Started' : 'View Profile'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to vote for {selectedCandidate?.name} in this election.
              Once submitted, your vote cannot be changed.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="flex items-center gap-4 my-4">
              <Avatar>
                <AvatarImage src={selectedCandidate.imageUrl} />
                <AvatarFallback className="bg-election-light-purple text-election-dark-purple">
                  {getInitials(selectedCandidate.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{selectedCandidate.name}</h4>
                <p className="text-sm text-gray-500">{selectedCandidate.position} • {selectedCandidate.party}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
              onClick={handleConfirmVote}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Confirm Vote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CandidateList;
