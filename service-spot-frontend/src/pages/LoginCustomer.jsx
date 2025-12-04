import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function LoginCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("role", "customer");

    alert("Customer Login Successful!");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="login-container">
      <FaUserCircle size={80} color="#0A4D68" />
      <h1>Customer Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" required onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
        </fieldset>

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}
