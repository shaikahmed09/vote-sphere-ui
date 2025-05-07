
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
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ElectionProps } from '@/components/elections/ElectionCard';

// Schema for election form validation
const electionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  startDate: z.string().refine(date => new Date(date) >= new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.string().refine(
    (date, ctx) => {
      const startDate = ctx.parent.startDate;
      return new Date(date) > new Date(startDate);
    },
    { message: "End date must be after start date" }
  ),
});

type ElectionFormValues = z.infer<typeof electionSchema>;

const ElectionManagement: React.FC = () => {
  const [elections, setElections] = useState<ElectionProps[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<ElectionFormValues>({
    resolver: zodResolver(electionSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    // Load elections from localStorage
    const storedElections = localStorage.getItem('elections');
    if (storedElections) {
      setElections(JSON.parse(storedElections));
    }
  }, []);

  const onSubmit = (values: ElectionFormValues) => {
    // Create a new election
    const newElection: ElectionProps = {
      id: `election-${Date.now()}`,
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      status: new Date(values.startDate) <= new Date() ? 'active' : 'upcoming',
      candidateCount: 0,
    };

    // Add to state and localStorage
    const updatedElections = [...elections, newElection];
    setElections(updatedElections);
    localStorage.setItem('elections', JSON.stringify(updatedElections));

    // Show success message
    toast({
      title: "Election Added",
      description: `"${values.title}" has been successfully added.`,
    });

    // Reset form
    form.reset();
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    // Remove election
    const updatedElections = elections.filter(election => election.id !== id);
    setElections(updatedElections);
    localStorage.setItem('elections', JSON.stringify(updatedElections));

    toast({
      title: "Election Deleted",
      description: "The election has been successfully removed.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Elections</h2>
        <Button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
        >
          {isAddingNew ? 'Cancel' : 'Add New Election'}
        </Button>
      </div>

      {isAddingNew && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Election</CardTitle>
            <CardDescription>
              Fill out the form to add a new election to the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Student Council Election 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details about this election..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
                  >
                    Create Election
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {elections.length > 0 ? (
          elections.map((election) => (
            <div key={election.id} className="border rounded-md p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{election.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                </p>
                <div className="text-xs text-gray-500 mt-1">
                  Status: <span className="font-medium capitalize">{election.status}</span> | Candidates: {election.candidateCount}
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(election.id)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No elections added yet. Create a new election to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionManagement;
