
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ElectionProps } from '@/components/elections/ElectionCard';
import ElectionForm, { ElectionFormValues } from './ElectionForm';
import ElectionList from './ElectionList';

const ElectionManagement: React.FC = () => {
  const [elections, setElections] = useState<ElectionProps[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load elections from localStorage
    const storedElections = localStorage.getItem('elections');
    if (storedElections) {
      setElections(JSON.parse(storedElections));
    }
  }, []);

  const handleAddElection = (values: ElectionFormValues) => {
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

    // Reset form and close
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

      {isAddingNew && <ElectionForm onSubmit={handleAddElection} />}

      <ElectionList elections={elections} onDelete={handleDelete} />
    </div>
  );
};

export default ElectionManagement;
