import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterCustomer.css";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    doorNo: "",
    addressLine: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    password: "",
    confirmPassword: "",
    latitude: "",
    longitude: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData({
        ...formData,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Submitted:", formData);
    alert("Customer Registered Successfully!");
    navigate("/login-customer");
  };

  return (
    <div className="customer-container">
      <h1>Customer Registration</h1>

      <form className="customer-form" onSubmit={handleSubmit}>

        {/* Personal Details */}
        <fieldset className="fieldset-box">
          <legend>Personal Details</legend>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="e.g., John Doe" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="e.g., john@example.com" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="mobile" placeholder="e.g., 9876543210" required onChange={handleChange} />
          </div>
        </fieldset>

        {/* Address Details */}
        <fieldset className="fieldset-box">
          <legend>Address Details</legend>

          <div className="form-group">
            <label>Door Number</label>
            <input type="text" name="doorNo" placeholder="e.g., 42" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address Line</label>
            <input type="text" name="addressLine" placeholder="e.g., Main Street, Sector 5" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" placeholder="e.g., Mumbai" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input type="text" name="pincode" placeholder="e.g., 400001" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" placeholder="e.g., Maharashtra" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" placeholder="e.g., India" required onChange={handleChange} />
          </div>
        </fieldset>

        {/* Password Section */}
        <fieldset className="fieldset-box">
          <legend>Security</legend>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="At least 8 characters" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Re-enter your password" required onChange={handleChange} />
          </div>
        </fieldset>

        {/* Location */}
        <fieldset className="fieldset-box">
          <legend>Location</legend>

          <div className="form-group">
            <label>Latitude</label>
            <input type="text" name="latitude" placeholder="Detected automatically" value={formData.latitude} readOnly />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input type="text" name="longitude" placeholder="Detected automatically" value={formData.longitude} readOnly />
          </div>

          <button type="button" onClick={detectLocation} className="location-btn">
            Detect My Location
          </button>
        </fieldset>

        <button type="submit" className="submit-btn">REGISTER</button>
      </form>
    </div>
  );
}
