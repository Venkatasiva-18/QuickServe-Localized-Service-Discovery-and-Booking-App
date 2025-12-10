import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export default function LoginCustomer() {

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  // ⭐ IF ALREADY LOGGED IN → GO TO DASHBOARD
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true" &&
        localStorage.getItem("role") === "customer") {
      navigate("/customer-dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/customer/login", form);

      if (res.data === true) {

        // FETCH CUSTOMER DETAILS
        const user = await axios.get(
          `http://localhost:8080/customer/byEmail/${form.email}`
        );

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("role", "customer");
        localStorage.setItem("customerName", user.data.name);
        localStorage.setItem("customerId", user.data.id);

        alert("Login Successful!");

        navigate("/customer-dashboard");
      } 
      else {
        alert("Invalid Email or Password");
      }
    } catch (err) {
      alert("Login Failed");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <FaUserCircle size={80} color="#0A4D68" />
      <h1>Customer Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <fieldset className="login-fieldset">
          <legend>Enter Details</legend>

          <label>Email</label>
          <input type="email" name="email" required onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" required onChange={handleChange} />

        </fieldset>

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
}
