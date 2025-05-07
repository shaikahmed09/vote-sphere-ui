
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ElectionManagement from './ElectionManagement';
import CandidateManagement from './CandidateManagement';
import VoterManagement from './VoterManagement';

const AdminDashboard: React.FC = () => {
  return (
    <Tabs defaultValue="elections" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="elections">Elections</TabsTrigger>
        <TabsTrigger value="candidates">Candidates</TabsTrigger>
        <TabsTrigger value="voters">Voters</TabsTrigger>
      </TabsList>
      <div className="mt-8">
        <TabsContent value="elections">
          <ElectionManagement />
        </TabsContent>
        <TabsContent value="candidates">
          <CandidateManagement />
        </TabsContent>
        <TabsContent value="voters">
          <VoterManagement />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default AdminDashboard;
