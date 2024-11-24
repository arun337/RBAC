// src/components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({ onLogout }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    } else {
      setError("No user details found in local storage");
    }
  }, []);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('userDetails');
    localStorage.removeItem('currentUser');
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails({ ...userDetails, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = () => {
    fetch(`http://localhost:3001/users/${userDetails.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to update user details");
        }
        return response.json();
      })
      .then(data => {
        setUserDetails(data);
        alert("Profile updated successfully!");
        setActiveTab('home'); // Redirect to home tab
      })
      .catch(error => {
        console.error("Error updating user details:", error);
        alert("Failed to update profile.");
      });
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!userDetails) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">User Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {userDetails.username}!</span>
            <button
              className={`py-2 px-4 ${activeTab === 'home' ? 'text-gray-300' : 'text-white'} hover:text-gray-300`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'profile' ? 'text-gray-300' : 'text-white'} hover:text-gray-300`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'home' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Home Content</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Profile</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="py-2">
                      {userDetails.profilePhoto ? (
                        <img
                          src={userDetails.profilePhoto}
                          alt={`${userDetails.username}'s profile`}
                          className="w-10 h-10 rounded-full mx-auto"
                        />
                      ) : (
                        <FaUserCircle size={40} className="text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-2">{userDetails.username}</td>
                    <td className="py-2">{userDetails.email}</td>
                    <td className="py-2">{userDetails.phone}</td>
                    <td className="py-2">{userDetails.role}</td>
                    <td className="py-2">{userDetails.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
              <form className="w-full max-w-md">
                <div className="mb-6 text-center">
                  {userDetails.profilePhoto ? (
                    <img
                      src={userDetails.profilePhoto}
                      alt={`${userDetails.username}'s profile`}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                  ) : (
                    <FaUserCircle size={96} className="text-gray-600 mx-auto mb-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userDetails.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleProfileUpdate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Update Profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;