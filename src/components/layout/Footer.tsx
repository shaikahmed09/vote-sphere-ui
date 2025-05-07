
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-election-purple to-election-dark-purple flex items-center justify-center">
                <span className="text-white font-bold">VS</span>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-election-purple to-election-dark-purple bg-clip-text text-transparent">VoteSphere</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Empowering student voices through fair and transparent elections.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/elections" className="text-sm text-gray-600 hover:text-election-purple">
                  Elections
                </Link>
              </li>
              <li>
                <Link to="/candidates" className="text-sm text-gray-600 hover:text-election-purple">
                  Candidates
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-sm text-gray-600 hover:text-election-purple">
                  Results
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Help</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-election-purple">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-election-purple">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-election-purple">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} VoteSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
