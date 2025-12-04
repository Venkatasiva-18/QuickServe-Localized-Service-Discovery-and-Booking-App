import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { FaUsers, FaUserShield, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    customers: 0,
    providers: 0,
    verified: 0,
    unverified: 0
  });

  // Later replace with backend API calls
  useEffect(() => {
    setStats({
      customers: 124,
      providers: 56,
      verified: 130,
      unverified: 50
    });
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card">
          <FaUsers size={40} color="#0A4D68" />
          <h3>{stats.customers}</h3>
          <p>Total Customers</p>
        </div>

        <div className="card">
          <FaUserShield size={40} color="#0A4D68" />
          <h3>{stats.providers}</h3>
          <p>Total Providers</p>
        </div>

        <div className="card">
          <FaCheckCircle size={40} color="green" />
          <h3>{stats.verified}</h3>
          <p>Verified Users</p>
        </div>

        <div className="card">
          <FaTimesCircle size={40} color="red" />
          <h3>{stats.unverified}</h3>
          <p>Pending Verification</p>
        </div>

      </div>

      <div className="admin-actions">
        <button onClick={() => window.location.href = '/admin-customers'}>
          Manage Customers
        </button>

        <button onClick={() => window.location.href = '/admin-providers'}>
          Manage Providers
        </button>
      </div>
    </div>
  );
}
