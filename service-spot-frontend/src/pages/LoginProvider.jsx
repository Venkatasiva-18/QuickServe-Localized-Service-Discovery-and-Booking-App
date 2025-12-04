import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";   // Provider icon

export default function LoginProvider() {
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

    // Save login info in localStorage
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("role", "provider");

    alert("Provider Login Successful!");
    navigate("/map");   // Redirect to Map View page
    window.location.reload();  // Refresh navbar
  };

  return (
    <div className="login-container">

      {/* Provider Icon */}
      <FaUserCog size={80} color="#0A4D68" />

      <h1>Provider Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>

        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input
            type="email"
            name="email"
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
        </fieldset>

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}
