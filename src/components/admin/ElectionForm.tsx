
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// Schema for election form validation
export const electionSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  startDate: z.string().refine(date => {
    return new Date(date) >= new Date();
  }, { 
    message: "Start date must be in the future" 
  }),
  endDate: z.string().refine(date => {
    return true; // Initial validation always passes, we'll check against startDate in onSubmit
  }, { 
    message: "End date must be after start date" 
  }),
});

export type ElectionFormValues = z.infer<typeof electionSchema>;

interface ElectionFormProps {
  onSubmit: (values: ElectionFormValues) => void;
}

const ElectionForm: React.FC<ElectionFormProps> = ({ onSubmit }) => {
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

  const handleSubmit = (values: ElectionFormValues) => {
    // Additional validation for end date
    if (new Date(values.endDate) <= new Date(values.startDate)) {
      form.setError("endDate", {
        type: "manual",
        message: "End date must be after start date"
      });
      return;
    }

    onSubmit(values);
    form.reset();
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create New Election</CardTitle>
        <CardDescription>
          Fill out the form to add a new election to the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
  );
};

export default ElectionForm;
