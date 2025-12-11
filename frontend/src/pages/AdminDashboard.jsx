import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { FaUsers, FaUserShield, FaCheckCircle, FaTimesCircle, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    customers: 0,
    providers: 0,
    services: 0,
    admins: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("loggedIn") || localStorage.getItem("role") !== "admin") {
      navigate("/login-admin");
      return;
    }
    
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const customersRes = await axios.get("http://localhost:8080/api/admin/customers");
      const providersRes = await axios.get("http://localhost:8080/api/admin/providers");
      const servicesRes = await axios.get("http://localhost:8080/api/admin/services");

      const customers = customersRes.data || [];
      const providers = providersRes.data || [];
      const services = servicesRes.data || [];
      
      const adminCount = customers.filter(c => c.role === "ADMIN").length + 
                        providers.filter(p => p.role === "ADMIN").length;

      setStats({
        customers: customers.length,
        providers: providers.length,
        services: services.length,
        admins: adminCount
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
              <FaTools size={40} color="#0A4D68" />
              <h3>{stats.services}</h3>
              <p>Total Services</p>
            </div>

            <div className="card">
              <FaCheckCircle size={40} color="green" />
              <h3>{stats.admins}</h3>
              <p>Total Admins</p>
            </div>
          </div>

          <div className="admin-actions">
            <button onClick={() => navigate('/admin-customers')}>
              Manage Customers
            </button>

            <button onClick={() => navigate('/admin-providers')}>
              Manage Providers
            </button>

            <button onClick={() => navigate('/book-service')}>
              View All Services
            </button>
          </div>
        </>
      )}
    </div>
  );
}
