
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProps } from '@/components/candidates/CandidateCard';
import { ElectionProps } from '@/components/elections/ElectionCard';

// Schema for candidate form validation
const candidateSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  position: z.string().min(3, { message: "Position must be at least 3 characters" }),
  party: z.string().min(2, { message: "Party must be at least 2 characters" }),
  slogan: z.string().min(5, { message: "Slogan must be at least 5 characters" }),
  imageUrl: z.string().optional(),
  electionId: z.string().min(1, { message: "Election must be selected" }),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

const CandidateManagement: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [elections, setElections] = useState<ElectionProps[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      position: "",
      party: "",
      slogan: "",
      imageUrl: "",
      electionId: "",
    },
  });

  useEffect(() => {
    // Load elections from localStorage
    const storedElections = localStorage.getItem('elections');
    if (storedElections) {
      setElections(JSON.parse(storedElections));
    }
    
    // Load candidates from localStorage
    const storedCandidates = localStorage.getItem('candidates');
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    }
  }, []);

  const onSubmit = (values: CandidateFormValues) => {
    // Create a new candidate
    const newCandidate: CandidateProps = {
      id: `candidate-${Date.now()}`,
      name: values.name,
      position: values.position,
      party: values.party,
      slogan: values.slogan,
      imageUrl: values.imageUrl,
      electionId: values.electionId,
    };

    // Add to state and localStorage
    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));

    // Update the candidate count in the election
    const updatedElections = elections.map(election => {
      if (election.id === values.electionId) {
        return {
          ...election,
          candidateCount: election.candidateCount + 1
        };
      }
      return election;
    });
    setElections(updatedElections);
    localStorage.setItem('elections', JSON.stringify(updatedElections));

    // Show success message
    toast({
      title: "Candidate Added",
      description: `${values.name} has been successfully added.`,
    });

    // Reset form
    form.reset();
    setIsAddingNew(false);
  };

  const handleDelete = (id: string, electionId: string) => {
    // Remove candidate
    const candidateToRemove = candidates.find(c => c.id === id);
    const updatedCandidates = candidates.filter(candidate => candidate.id !== id);
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));

    // Update the candidate count in the election
    if (candidateToRemove) {
      const updatedElections = elections.map(election => {
        if (election.id === electionId) {
          return {
            ...election,
            candidateCount: Math.max(0, election.candidateCount - 1)
          };
        }
        return election;
      });
      setElections(updatedElections);
      localStorage.setItem('elections', JSON.stringify(updatedElections));
    }

    toast({
      title: "Candidate Deleted",
      description: "The candidate has been successfully removed.",
    });
  };

  // Get election title by ID
  const getElectionTitle = (electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    return election ? election.title : 'Unknown Election';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Candidates</h2>
        <Button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
        >
          {isAddingNew ? 'Cancel' : 'Add New Candidate'}
        </Button>
      </div>

      {isAddingNew && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Candidate</CardTitle>
            <CardDescription>
              Fill out the form to add a new candidate to an election.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="President" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="party"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party</FormLabel>
                        <FormControl>
                          <Input placeholder="Student First" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slogan</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Together we can make a difference" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave blank to use an avatar with initials
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="electionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Election</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an election" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {elections.length > 0 ? (
                            elections.map((election) => (
                              <SelectItem key={election.id} value={election.id}>
                                {election.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-elections" disabled>
                              No elections available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The election this candidate will participate in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
                    disabled={elections.length === 0}
                  >
                    Add Candidate
                  </Button>
                </div>
                
                {elections.length === 0 && (
                  <div className="text-center text-red-500 text-sm">
                    You need to create at least one election before adding candidates.
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.id} className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{candidate.name}</h3>
                <p className="text-sm text-gray-500">
                  {candidate.position} | {candidate.party}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  Election: {getElectionTitle(candidate.electionId)}
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(candidate.id, candidate.electionId)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No candidates added yet. Create a new candidate to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateManagement;
