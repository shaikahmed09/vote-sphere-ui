
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out of admin dashboard",
    });
    navigate('/admin');
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-500">
            Manage elections, candidates, and monitor voting activities.
          </p>
        </div>
        
        {isAuthenticated ? (
          <>
            <div className="flex justify-end mb-4">
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
            <AdminDashboard />
          </>
        ) : (
          <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
        )}
      </div>
    </Layout>
  );
};

export default Admin;
