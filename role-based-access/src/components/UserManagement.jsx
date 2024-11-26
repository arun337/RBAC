// src/components/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { FaUser, FaUserShield, FaEdit, FaTrash } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    role: "user",
    status: "active",

    email: "",
    phone: "",
    profilePhoto: "",
 
  });
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});

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

  const validateUser = () => {
    const { username, email, phone, password, age } = newUser;
    
    const newErrors = {};

    // Validate username
    if (!username) {
      newErrors.username = "Username is required.";
    } else if (users.some(user => user.username === username)) {
      newErrors.username = "This username is already taken.";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "A valid email is required.";
    }

    // Validate phone
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "A valid 10-digit phone number is required.";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Validate age
    if (age && (isNaN(age) || age < 0)) {
      newErrors.age = "Age must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addUser = () => {
    if (!validateUser()) return;

    const newUserId = (users.length + 1).toString();
    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newUser, id: newUserId })
    })
    .then(response => response.json())
    .then(user => setUsers([...users, user]))
    .catch(error => console.error("Error adding user:", error));
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
    setEditingUser(user);
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const validateEditingUser = () => {
    const { username, email, phone, password } = editingUser;
    
    const newErrors = {};

    // Validate username
    if (!username) {
      newErrors.username = "Username is required.";
    } else if (users.some(user => user.username === username && user.id !== editingUser.id)) {
      newErrors.username = "This username is already taken.";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "A valid email is required.";
    }

    // Validate phone
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "A valid 10-digit phone number is required.";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUser = () => {
    if (!validateEditingUser()) return;

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
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
        {errors.username && <span className="text-red-500">{errors.username}</span>}
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border p-2 rounded"
        >
          {roles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
        {errors.email && <span className="text-red-500">{errors.email}</span>}
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
        {errors.phone && <span className="text-red-500">{errors.phone}</span>}
        <input
          type="text"
          placeholder="Phone Number"
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
        <input
          type="file"
          onChange={(e) => handleFileChange(e)}
          className="border p-2 rounded"
        />
        {errors.password && <span className="text-red-500">{errors.password}</span>}
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-2 rounded"
        />
        <button onClick={addUser} className="bg-blue-500 text-white p-2 rounded">
          Add User
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <img
              src={user.profilePhoto || "https://via.placeholder.com/100"}
              alt={`${user.username}'s profile`}
              className="w-24 h-24 rounded-full mb-2"
            />
            <h3 className="text-lg font-bold">{user.username}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">{user.phone}</p>
            <div className="flex items-center mt-2">
              {user.role === "admin" ? (
                <FaUserShield className="text-yellow-500 mr-1" />
              ) : (
                <FaUser className="text-blue-500 mr-1" />
              )}
              <span className="text-sm">{user.role}</span>
            </div>
            <div className="flex mt-4 space-x-2">
              <button onClick={() => startEditing(user)} className="text-blue-500">
                <FaEdit />
              </button>
              <button onClick={() => deleteUser(user.id)} className="text-red-500">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Edit User</h3>
          <input
            type="text"
            value={editingUser.username}
            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
            className="border p-2 rounded mb-2"
          />
          {errors.username && <span className="text-red-500">{errors.username}</span>}
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
            className="border p-2 rounded mb-2"
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
          <input
            type="text"
            value={editingUser.phone}
            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
            className="border p-2 rounded mb-2"
          />
          {errors.phone && <span className="text-red-500">{errors.phone}</span>}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, true)}
            className="border p-2 rounded mb-2"
          />
          <input
            type="password"
            value={editingUser.password}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
            className="border p-2 rounded mb-2"
          />
          {errors.password && <span className="text-red-500">{errors.password}</span>}
          <select
            value={editingUser.status}
            onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
            className="border p-2 rounded mb-2 ml-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div>
            <button onClick={saveUser} className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
            <button onClick={cancelEditing} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;