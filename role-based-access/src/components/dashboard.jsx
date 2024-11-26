
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import Books from './Books';

import Home from './Home';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); 
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-gray-300 ${activeTab === 'home' ? 'text-gray-300' : ''}`}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`hover:text-gray-300 ${activeTab === 'users' ? 'text-gray-300' : ''}`}
            >
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('roles')}
              className={`hover:text-gray-300 ${activeTab === 'roles' ? 'text-gray-300' : ''}`}
            >
              Roles
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('books')}
              className={`hover:text-gray-300 ${activeTab === 'books' ? 'text-gray-300' : ''}`}
            >
              Books
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'home' && <Home user={user} />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'roles' && <RoleManagement />}
        {activeTab === 'books' && <Books />}
      </div>
    </div>
  );
};

export default Dashboard;