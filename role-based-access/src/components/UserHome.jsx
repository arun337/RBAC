import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const UserHome = ({ currentUser }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3001/users?username=${currentUser.username}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 0) {
            setUserDetails(data[0]);
          } else {
            setError("User not found");
          }
        })
        .catch(error => {
          console.error("Error fetching user details:", error);
          setError("Failed to load user details");
        });
    } else {
      setError("No user is logged in");
    }
  }, [currentUser]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!userDetails) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6">Welcome, {userDetails.username}!</h2>
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
    </div>
  );
};

export default UserHome; 