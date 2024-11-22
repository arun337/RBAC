import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Login from "./components/login";
import Dashboard from './components/dashboard';
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </div>
  );
}

export default App;
