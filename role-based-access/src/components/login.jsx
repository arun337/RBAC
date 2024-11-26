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
  const [errors, setErrors] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let messages = {};
    
    if (isRegistering) {
     
        const response = await fetch("http://localhost:3001/users");
        const users = await response.json();
        const isNameTaken = users.some(u => u.username === name);
        if (isNameTaken) {
          messages.name = "This name is already registered. Please choose another.";
        }
      
    }
    
    if (!name) {
      messages.name = "Name is required.";
    }
    
    if (isRegistering) {
      if (!email) {
        messages.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        messages.email = "Email is not valid.";
      }
      if (!phone) {
        messages.phone = "Phone number is required.";
      } else if (!/^\d{10}$/.test(phone)) {
        messages.phone = "Phone number must be 10 digits.";
      }
      if (!password) {
        messages.password = "Password is required.";
      } else if (password.length < 8) {
        messages.password = "Password must be at least 8 characters.";
      }
    } else {
      if (!password) {
        messages.password = "Password is required.";
      }
    }
    
    if (Object.keys(messages).length > 0) {
      setErrors(messages);
      return;
    }
    
    if (isRegistering) {
      if (!name || !email || !phone || !password) {
        alert("Please fill in all fields.");
        return;
      }
      const registrationSuccess = await registerUser(name, password, email, phone, photo);
      if (registrationSuccess) {
        alert("Registration successful! You are now logged in.");
        const userDetails = { username: name, email, phone, profilePhoto: photo, role: "user" };
        setUser(userDetails);
        localStorage.setItem("userDetails", JSON.stringify(userDetails)); // Store complete user details in local storage
        navigate("/user-dashboard");
      }
    } else {
      if (!name || !password) {
        setErrors({ ...errors, form: "Please fill in both fields." });
        return;
      }
      const user = await fetchUserDetails(name, password);
      if (user) {
        setUser(user);
        localStorage.setItem("userDetails", JSON.stringify(user)); // Store complete user details in local storage
        if (user.role === "admin") {
          navigate("/dashboard");
        } else if (user.role === "author") {
          navigate("/authormanagement");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setErrors({ ...errors, form: "Invalid username or password." });
      }
    }
    setPassword(""); // Reset password field
  };

  const fetchUserDetails = async (username, password) => {
    const response = await fetch("http://localhost:3001/users");
    const users = await response.json();
    const user = users.find(u => u.username === username);

    if (!user) {
      return null;
    }

    if (user.password !== password) {
      return null;
    }

    return user; // Return the complete user object
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
      role: "author", // Set role to author for new users
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
    console.log("Resetting fields");
    setName("");
    setEmail("");
    setPhone("");
    setPhoto("");
    setPassword("");
    setErrors({ name: "", password: "", email: "", phone: "", form: "" }); // Reset errors as well
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const saveBook = async (book) => {
    const response = await fetch("http://localhost:3001/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });

    return response.ok; // Return true if saving was successful
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-login">
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
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: "" }); // Clear error on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" }); // Clear error on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="number"
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors({ ...errors, phone: "" }); // Clear error on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" }); // Clear error on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
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
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: "" }); // Clear error on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" }); // Clear error on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
              {errors.form && <span className="text-red-500 text-sm">{errors.form}</span>}
            </>
          )}
        </form>
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            resetFields(); // Reset all fields when toggling between login and registration
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