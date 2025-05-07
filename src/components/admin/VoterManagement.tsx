
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VoterType {
  id: string;
  name: string;
  email: string;
  studentId: string;
  verified: boolean;
}

const VoterManagement: React.FC = () => {
  const [voters, setVoters] = useState<VoterType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load registered voters from localStorage
    const storedVoters = localStorage.getItem('registeredVoters');
    if (storedVoters) {
      setVoters(JSON.parse(storedVoters));
    }
  }, []);

  const handleVerify = (id: string) => {
    const updatedVoters = voters.map(voter => {
      if (voter.id === id) {
        return { ...voter, verified: true };
      }
      return voter;
    });
    
    setVoters(updatedVoters);
    localStorage.setItem('registeredVoters', JSON.stringify(updatedVoters));
    
    toast({
      title: "Voter Verified",
      description: "The voter has been verified and can now vote in elections.",
    });
  };

  const handleUnverify = (id: string) => {
    const updatedVoters = voters.map(voter => {
      if (voter.id === id) {
        return { ...voter, verified: false };
      }
      return voter;
    });
    
    setVoters(updatedVoters);
    localStorage.setItem('registeredVoters', JSON.stringify(updatedVoters));
    
    toast({
      title: "Voter Status Changed",
      description: "The voter verification status has been updated.",
    });
  };

  const handleDelete = (id: string) => {
    const updatedVoters = voters.filter(voter => voter.id !== id);
    setVoters(updatedVoters);
    localStorage.setItem('registeredVoters', JSON.stringify(updatedVoters));
    
    toast({
      title: "Voter Deleted",
      description: "The voter has been removed from the system.",
    });
  };

  const filteredVoters = voters.filter(voter => 
    voter.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Voters</h2>
        <div className="w-1/3">
          <Input
            type="text"
            placeholder="Search voters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVoters.length > 0 ? (
              filteredVoters.map((voter) => (
                <TableRow key={voter.id}>
                  <TableCell>{voter.name}</TableCell>
                  <TableCell>{voter.email}</TableCell>
                  <TableCell>{voter.studentId}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${voter.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {voter.verified ? 'Verified' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {voter.verified ? (
                        <Button variant="outline" size="sm" onClick={() => handleUnverify(voter.id)}>
                          Unverify
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleVerify(voter.id)}>
                          Verify
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(voter.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  {searchTerm ? 'No voters match your search.' : 'No registered voters yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VoterManagement;
