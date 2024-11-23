import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const activeTab = location.pathname;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className={`hover:text-gray-300 ${activeTab === '/' ? 'text-gray-300' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`hover:text-gray-300 ${activeTab === '/dashboard' ? 'text-gray-300' : ''}`}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout; 