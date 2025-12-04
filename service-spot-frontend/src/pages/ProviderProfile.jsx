import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProviderProfile.css";
import { FaUserTie, FaEdit } from "react-icons/fa";

export default function ProviderProfile() {
  const providerId = localStorage.getItem("providerId") || 1;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/provider/${providerId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error fetching provider profile:", err);
        setError("Unable to load profile. Please try again later.");
        setLoading(false);
      });
  }, [providerId]);

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
    <div className="provider-profile-container">

      <div className="profile-icon">
        <FaUserTie size={120} color="#0A4D68" />
      </div>

      <h1>Provider Profile</h1>

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

        {/* SERVICE DETAILS */}
        <fieldset className="fieldset-box">
          <legend>Service Details</legend>

          <label>Service Type</label>
          <input type="text" value={profile.serviceType} readOnly />

          <label>Approx Price</label>
          <input type="text" value={profile.price} readOnly />
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

        {/* VERIFICATION STATUS */}
        <fieldset className="fieldset-box">
          <legend>Status</legend>

          {profile.verified ? (
            <p className="verified-status">✔ Verified Provider</p>
          ) : (
            <p className="unverified-status">✖ Not Verified</p>
          )}
        </fieldset>

      </form>

      <Link to="/provider-update" className="edit-profile-btn">
        <FaEdit /> Edit Profile
      </Link>
    </div>
  );
}
