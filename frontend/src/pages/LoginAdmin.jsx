import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";   // Admin icon

export default function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    // Check if redirected from password reset
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType("success");
      
      // Pre-fill email if provided
      if (location.state?.email) {
        setForm(prev => ({ ...prev, email: location.state.email }));
      }
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }

    // If already logged in, redirect
    if (localStorage.getItem("loggedIn") === "true" &&
        localStorage.getItem("role") === "admin") {
      navigate("/admin-dashboard");
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("role", "admin");
        localStorage.setItem("adminId", data.id);
        localStorage.setItem("adminName", data.name);
        localStorage.setItem("adminEmail", data.email || form.email); // ⭐ For WebSocket notifications

        setMessage("Admin Login Successful!");
        setMessageType("success");
        
        setTimeout(() => {
          navigate("/admin-dashboard");
          window.location.reload();
        }, 1000);
      } else {
        setMessage("Invalid email or password");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Error connecting to server. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="login-container">

      {/* Admin Icon */}
      <FaUserShield size={80} color="#0A4D68" />

      <h1>Admin Login</h1>

      {message && (
        <div className={`login-message ${messageType}`}>
          {message}
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>

        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Enter admin email"
            required
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            required
            onChange={handleChange}
          />

          <div className="forgot-password-link-container">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
        </fieldset>

        <button className="login-btn">Login</button>
      </form>

      <div className="register-link-container">
        <p>
          Not an admin?{" "}
          <Link to="/login-customer">Login as Customer</Link>
        </p>
      </div>
    </div>
  );
}
