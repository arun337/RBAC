// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import UserDashboard from "./components/UserDashboard";
import Dashboard from "./components/dashboard";
import UserHome from "./components/UserHome";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null); // Clear user state
    // Optionally, you can add more logic here, like clearing tokens or session data
  };

  return (
   
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/user-dashboard" element={<UserDashboard currentUser={user} onLogout={handleLogout} />} />
        <Route path="/user-home" element={<UserHome currentUser={user} />} />
      </Routes>
  
  );
};

export default App;