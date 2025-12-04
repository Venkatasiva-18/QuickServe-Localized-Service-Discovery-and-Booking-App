import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CustomerProfile.css";
import { FaUserCircle, FaEdit } from "react-icons/fa";

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = localStorage.getItem("customerId") || 1;

  useEffect(() => {
    fetch(`http://localhost:8080/api/customer/${customerId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error fetching profile:", err);
        setError("Unable to load profile. Please try again later.");
        setLoading(false);
      });
  }, [customerId]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p>{error}</p>
        <p>Please ensure the backend server is running on port 8080.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      
      {/* ICON */}
      <div className="profile-icon">
        <FaUserCircle size={120} color="#0A4D68" />
      </div>

      <h1>Customer Profile</h1>

      <form className="profile-form">

        {/* PERSONAL DETAILS */}
        <fieldset className="fieldset-box">
          <legend>Personal Details</legend>

          <label>Name</label>
          <input type="text" value={profile.name} readOnly />

          <label>Email</label>
          <input type="text" value={profile.email} readOnly />

          <label>Mobile</label>
          <input type="text" value={profile.mobile} readOnly />
        </fieldset>

        {/* ADDRESS DETAILS */}
        <fieldset className="fieldset-box">
          <legend>Address</legend>

          <label>Door No</label>
          <input type="text" value={profile.doorNo} readOnly />

          <label>Address Line</label>
          <input type="text" value={profile.addressLine} readOnly />

          <label>City</label>
          <input type="text" value={profile.city} readOnly />

          <label>State</label>
          <input type="text" value={profile.state} readOnly />

          <label>Country</label>
          <input type="text" value={profile.country} readOnly />

          <label>Pincode</label>
          <input type="text" value={profile.pincode} readOnly />
        </fieldset>

        {/* LOCATION */}
        <fieldset className="fieldset-box">
          <legend>Location</legend>

          <label>Latitude</label>
          <input type="text" value={profile.latitude} readOnly />

          <label>Longitude</label>
          <input type="text" value={profile.longitude} readOnly />
        </fieldset>

        {/* STATUS */}
        <fieldset className="fieldset-box">
          <legend>Verification Status</legend>

          {profile.verified ? (
            <p className="verified-status">✔ Verified Customer</p>
          ) : (
            <p className="unverified-status">✖ Not Verified</p>
          )}
        </fieldset>

      </form>

      <Link to="/customer-update" className="edit-profile-btn">
        <FaEdit /> Edit Profile
      </Link>
    </div>
  );
}
