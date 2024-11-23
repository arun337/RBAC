// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Check if all registration fields are filled
      if (!name || !email || !phone || !password) {
        alert("Please fill in all fields.");
        return;
      }
      const registrationSuccess = await registerUser(name, password, email, phone, photo);
      if (registrationSuccess) {
        alert("Registration successful! You are now logged in.");
        setUser({ username: name, role: "user" }); // Use name as username
        navigate("/user-dashboard");
      }
    } else {
      // Check if login fields are filled
      if (!name || !password) {
        alert("Please fill in both fields.");
        return;
      }
      const userRole = await fetchUserRole(name, password);
      if (userRole) {
        setUser({ username: name, role: userRole });
        if (userRole === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert("Invalid credentials.");
      }
    }
    setPassword(""); // Reset password field
  };

  const fetchUserRole = async (username, password) => {
    const response = await fetch("http://localhost:3001/users");
    const users = await response.json();
    const user = users.find(u => u.username === username && u.password === password);
    return user ? user.role : null;
  };

  const registerUser = async (name, password, email, phone, photo) => {
    const readFileAsDataURL = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    let profilePhoto = "";
    if (photo) {
      try {
        profilePhoto = await readFileAsDataURL(photo);
      } catch (error) {
        console.error("Error reading photo file:", error);
        return false;
      }
    }

    const newUser = {
      username: name, // Use name as username
      password,
      email,
      phone,
      profilePhoto, // Use base64 string for photo
      role: "user", // Default role for new users
      status: "active", // Set initial status to active
    };

    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    return response.ok; // Return true if registration was successful
  };

  const resetFields = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPhoto("");
    setPassword("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
          {isRegistering ? "Register" : "Login"}
        </h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-600">
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-2 text-white bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Register
              </button>
            </>
          )}
          {!isRegistering && (
            <>
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
            </>
          )}
        </form>
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            resetFields(); // Reset all fields
          }}
          className="w-full mt-3 text-blue-500 hover:underline"
        >
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;