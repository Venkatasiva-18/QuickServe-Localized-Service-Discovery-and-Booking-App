import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";   // Admin icon

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save login info for admin
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("role", "admin");

    alert("Admin Login Successful!");
    navigate("/admin-dashboard");   // Later we will build this page
    window.location.reload();       // Refresh navbar
  };

  return (
    <div className="login-container">

      {/* Admin Icon */}
      <FaUserShield size={80} color="#0A4D68" />

      <h1>Admin Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>

        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input
            type="email"
            name="email"
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
        </fieldset>

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}
