// src/components/Dashboard.jsx
import React from 'react';
import { FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <ul className="space-y-4">
          <li><a href="#" className="hover:text-gray-300">Dashboard</a></li>
          <li><a href="#" className="hover:text-gray-300">Users</a></li>
          <li><a href="#" className="hover:text-gray-300">Settings</a></li>
          <li><a href="#" className="hover:text-gray-300">Reports</a></li>
          <li><a href="#" className="hover:text-gray-300">Notifications</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-1/2 max-w-lg">
            <input
              type="text"
              className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="flex items-center space-x-4">
            <FaBell className="text-xl cursor-pointer" />
            <FaUserCircle className="text-2xl cursor-pointer" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Users</h3>
            <p className="text-3xl font-bold text-blue-800 mt-2">1,250</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Posts</h3>
            <p className="text-3xl font-bold text-blue-800 mt-2">300</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Comments</h3>
            <p className="text-3xl font-bold text-blue-800 mt-2">2,150</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Likes</h3>
            <p className="text-3xl font-bold text-blue-800 mt-2">4,500</p>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-semibold text-gray-600">
                <th className="px-4 py-2">Activity</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">User created a new post</td>
                <td className="px-4 py-2">Nov 23, 2024</td>
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2 text-green-600">Active</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">User liked a post</td>
                <td className="px-4 py-2">Nov 22, 2024</td>
                <td className="px-4 py-2">Jane Smith</td>
                <td className="px-4 py-2 text-gray-500">Inactive</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">User commented on a post</td>
                <td className="px-4 py-2">Nov 21, 2024</td>
                <td className="px-4 py-2">Mark Johnson</td>
                <td className="px-4 py-2 text-green-600">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
