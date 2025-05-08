
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-election-purple">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Page not found</h2>
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              asChild 
              className="bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
            >
              <Link to="/">
                Go back home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={goBack} 
              className="mt-3 sm:mt-0"
            >
              Go back to previous page
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
