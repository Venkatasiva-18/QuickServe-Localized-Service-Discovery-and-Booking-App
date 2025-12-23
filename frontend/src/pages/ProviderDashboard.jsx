import React, { useEffect, useState } from "react";
import "./ProviderDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import useLiveLocation from "../hooks/UseLiveLocation";

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem("providerId");

  // 🔥 START LIVE LOCATION (AUTO)
  useLiveLocation(providerId);

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProvider = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/provider/${providerId}`
      );
      setProvider(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Provider fetch error", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !localStorage.getItem("loggedIn") ||
      localStorage.getItem("role") !== "provider"
    ) {
      navigate("/login-provider");
      return;
    }

    if (!providerId) {
      alert("Provider ID missing");
      navigate("/login-provider");
      return;
    }

    fetchProvider();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login-provider");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <h1>Provider Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="provider-info-card">
        <h2>{provider.name}</h2>
        <p><strong>Email:</strong> {provider.email}</p>
        <p><strong>Phone:</strong> {provider.phone}</p>
        <p><strong>Status:</strong> Live Location Sharing ON ✅</p>
      </div>
    </div>
  );
}
