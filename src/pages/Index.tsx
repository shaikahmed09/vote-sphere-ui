import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ElectionCard, { ElectionProps } from '@/components/elections/ElectionCard';

const featuredElections: ElectionProps[] = [
  {
    id: '1',
    title: 'Student Council Elections',
    description: 'Vote for your representatives in the Student Council for the academic year 2025-2026.',
    startDate: '2025-05-10',
    endDate: '2025-05-17',
    status: 'active',
    candidateCount: 12,
  },
  {
    id: '2',
    title: 'Department Representative Election',
    description: 'Choose your department representatives who will voice your concerns to the faculty.',
    startDate: '2025-05-20',
    endDate: '2025-05-25',
    status: 'upcoming',
    candidateCount: 8,
  },
  {
    id: '3',
    title: 'Club Leadership Selection',
    description: 'Vote for the new leadership team for various clubs and societies on campus.',
    startDate: '2025-04-15',
    endDate: '2025-04-22',
    status: 'completed',
    candidateCount: 24,
  },
];

const Index = () => {
  const [featuredElections, setFeaturedElections] = useState<ElectionProps[]>([]);
  
  useEffect(() => {
    // Load real elections from localStorage
    const storedElections = localStorage.getItem('elections');
    if (storedElections) {
      const allElections = JSON.parse(storedElections);
      // Get up to 3 elections to feature
      const featuredItems = allElections.slice(0, 3);
      setFeaturedElections(featuredItems);
    } else {
      setFeaturedElections([]);
    }
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-28 lg:max-w-2xl lg:w-full">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Your voice,</span>
                  <span className="block bg-gradient-to-r from-election-purple to-election-dark-purple bg-clip-text text-transparent">your choice.</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Empowering students through fair, transparent, and accessible elections. Make your voice heard and shape the future of your campus.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button asChild size="lg" className="w-full bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90">
                      <Link to="/elections">
                        Explore Elections
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button asChild variant="outline" size="lg" className="w-full border-election-purple text-election-purple hover:bg-election-light-purple/20">
                      <Link to="/register">
                        Register to Vote
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-election-purple to-election-dark-purple opacity-70 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-16 w-16 mx-auto animate-pulse-slow">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold">Democracy in Action</p>
              <p className="mt-2 opacity-80">Secure & Transparent Voting System</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Elections */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Elections</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500">
              Participate in these ongoing elections or check out upcoming opportunities to make your voice heard.
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredElections.length > 0 ? (
              featuredElections.map((election) => (
                <ElectionCard key={election.id} {...election} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No elections have been added yet. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="border-election-purple text-election-purple hover:bg-election-light-purple/20">
              <Link to="/elections">
                View All Elections
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500">
              VoteSphere makes participating in campus elections simple, secure, and accessible.
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-election-light-purple text-election-dark-purple">
                  <span className="text-lg font-semibold">1</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Register</h3>
                <p className="mt-2 text-center text-gray-500">
                  Create an account using your student email and verify your identity.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-election-light-purple text-election-dark-purple">
                  <span className="text-lg font-semibold">2</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Explore</h3>
                <p className="mt-2 text-center text-gray-500">
                  Browse active elections and learn about the candidates and their platforms.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-election-light-purple text-election-dark-purple">
                  <span className="text-lg font-semibold">3</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Vote</h3>
                <p className="mt-2 text-center text-gray-500">
                  Cast your vote securely and track the results in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-election-purple py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Ready to make your voice heard?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-election-light-purple">
              Join thousands of students who are actively participating in campus democracy.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" className="bg-white text-election-dark-purple hover:bg-gray-100">
                <Link to="/register">
                  Get Started Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
