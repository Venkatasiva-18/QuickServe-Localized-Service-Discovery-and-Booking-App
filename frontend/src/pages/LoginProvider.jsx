import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaUserCog } from "react-icons/fa";

export default function LoginProvider() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    // Check if redirected from registration or password reset
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
        localStorage.getItem("role") === "provider") {
      navigate("/provider-profile");
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
      const payload = {
        email: form.email,
        password: form.password
      };

      const response = await axios.post("http://localhost:8080/api/provider/login", payload);

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", "provider");
      localStorage.setItem("providerName", response.data.name);
      localStorage.setItem("providerId", response.data.id);
      localStorage.setItem("providerEmail", response.data.email || form.email); // ⭐ For WebSocket notifications

      setMessage("Provider Login Successful!");
      setMessageType("success");
      
      setTimeout(() => {
        navigate("/provider-profile");
        window.location.reload();
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data || "Login failed. Please check your credentials.";
      
      // Check if it's an email verification error
      if (typeof errorMessage === 'string' && errorMessage.includes("verify your email")) {
        setMessage(errorMessage);
        setMessageType("error");
        
        // Redirect to OTP verification page
        setTimeout(() => {
          navigate("/verify-email", { state: { email: form.email } });
        }, 2000);
      } else {
        setMessage(typeof errorMessage === 'string' ? errorMessage : "Login failed");
        setMessageType("error");
      }
      console.error(err);
    }
  };

  return (
    <div className="login-container">

      {/* Provider Icon */}
      <FaUserCog size={80} color="#0A4D68" />

      <h1>Provider Login</h1>

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
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
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
          Don't have an account?{" "}
          <Link to="/register-provider">Register here</Link>
        </p>
      </div>
    </div>
  );
}
