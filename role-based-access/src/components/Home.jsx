import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUser,  FaSearch } from "react-icons/fa";

const Home = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newUser, setNewUser] = useState({
      username: "",
      role: "user",
      status: "active",
      name: "",
      email: "",
      phone: "",
      profilePhoto: "",
      
    });
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    useEffect(() => {
      fetch("http://localhost:3001/users")
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => console.error("Error fetching users:", error));
  
      fetch("http://localhost:3001/roles")
        .then(response => response.json())
        .then(data => setRoles(data))
        .catch(error => console.error("Error fetching roles:", error));
    }, []);
  
    const handleFileChange = (e, isEditing = false) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isEditing) {
            setEditingUser({ ...editingUser, profilePhoto: reader.result });
          } else {
            setNewUser({ ...newUser, profilePhoto: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    };
  
   
  
    const deleteUser = (id) => {
      fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE"
      })
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error("Error deleting user:", error));
    };
  
    const startEditing = (user) => {
      if (editingUser && editingUser.id === user.id) {
        setEditingUser(null);
      } else {
        setEditingUser(user);
      }
    };
  
    const cancelEditing = () => {
      setEditingUser(null);
    };
  
    const saveUser = () => {
      
      const isNameTaken = users.some(user => user.username !== editingUser.username && user.name === editingUser.name);

      if (isNameTaken) {
        setErrorMessage("The name is already taken by another user.");
        return;
      }

    
      setErrorMessage("");

      fetch(`http://localhost:3001/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser)
      })
      .then(response => response.json())
      .then(updatedUser => {
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        setEditingUser(null);
      })
      .catch(error => console.error("Error updating user:", error));
    };
  
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Welcome  </h2>
  
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-full w-96 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
  
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Profile</th>
              <th className="py-2">Username</th>
              <th className="py-2">Email</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Role</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(user => 
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) && user.role !== "admin"
              )
              .map(user => (
                <React.Fragment key={user.id}>
                  <tr className="text-center">
                    <td className="py-2">
                      <img
                        src={user.profilePhoto || "https://via.placeholder.com/100"}
                        alt={`${user.username}'s profile`}
                        className="w-12 h-12 rounded-full mx-auto"
                      />
                    </td>
                    <td className="py-2">{user.username}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.phone}</td>
                    <td className="py-2">
                      <FaUser className="text-blue-500 inline-block" />
                      <span className="ml-1">{user.role}</span>
                    </td>
                    <td className="py-2">{user.status}</td>
                    <td className="py-2">
                      <button onClick={() => startEditing(user)} className="text-blue-500 mx-1">
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="text-red-500 mx-1">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  {editingUser && editingUser.id === user.id && (
                    <tr>
                      <td colSpan="7" className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">Edit User</h3>
                        <input
                          type="text"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                          placeholder="Enter username"
                          className="border p-2 rounded mb-2"
                        />
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="border p-2 rounded mb-2 ml-2"
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          placeholder="Enter email"
                          className="border p-2 rounded mb-2"
                        />
                        <input
                          type="text"
                          value={editingUser.phone}
                          onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                          placeholder="Enter phone number"
                          className="border p-2 rounded mb-2"
                        />
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, true)}
                          className="border p-2 rounded mb-2"
                        />
                        <select
                          value={editingUser.status}
                          onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                          className="border p-2 rounded mb-2 ml-2"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <p className="text-red-500">{errorMessage}</p>
                        <div>
                          <button onClick={saveUser} className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                          <button onClick={cancelEditing} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    );
};

export default Home;