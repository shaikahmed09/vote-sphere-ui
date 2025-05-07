
import React from 'react';
import { Button } from '@/components/ui/button';
import { ElectionProps } from '@/components/elections/ElectionCard';
import { Link } from 'react-router-dom';

interface ElectionListProps {
  elections: ElectionProps[];
  onDelete: (id: string) => void;
}

const ElectionList: React.FC<ElectionListProps> = ({ elections, onDelete }) => {
  return (
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
            <div className="flex space-x-2">
              <Link to={`/elections/${election.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(election.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No elections added yet. Create a new election to get started.
        </div>
      )}
    </div>
  );
};

export default ElectionList;
