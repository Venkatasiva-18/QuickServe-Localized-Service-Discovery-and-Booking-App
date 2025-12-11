import React, { useEffect, useState } from "react";
import "./ProviderDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaStar, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem("providerId");
  
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingService, setEditingService] = useState(null);
  
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    if (!localStorage.getItem("loggedIn") || localStorage.getItem("role") !== "provider") {
      navigate("/login-provider");
      return;
    }

    if (!providerId) {
      alert("Provider ID not found");
      navigate("/login-provider");
      return;
    }

    fetchProviderData();
    fetchCategories();
  }, []);

  const fetchProviderData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/provider/${providerId}`);
      setProvider(res.data);

      const servicesRes = await axios.get(
        `http://localhost:8080/api/services/provider/${providerId}`
      );
      setServices(servicesRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching provider data:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!newService.name || !newService.description || !newService.categoryId || 
        !newService.price || !newService.city || !newService.state || !newService.pincode) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Fetch category to ensure it exists
      const categoryRes = await axios.get(`http://localhost:8080/api/category/${newService.categoryId}`);
      const category = categoryRes.data;
      
      // Fetch provider to ensure it exists
      const providerRes = await axios.get(`http://localhost:8080/api/provider/${providerId}`);
      const provider = providerRes.data;

      const serviceData = {
        name: newService.name,
        description: newService.description,
        category: { id: parseInt(newService.categoryId) },
        provider: { id: parseInt(providerId) },
        price: parseFloat(newService.price),
        city: newService.city,
        state: newService.state,
        pincode: parseInt(newService.pincode),
        isActive: true
      };

      await axios.post("http://localhost:8080/api/services", serviceData);
      alert("Service added successfully!");
      setNewService({
        name: "",
        description: "",
        categoryId: "",
        price: "",
        city: "",
        state: "",
        pincode: ""
      });
      setShowAddServiceForm(false);
      fetchProviderData();
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:8080/api/services/${serviceId}`);
        alert("Service deleted successfully!");
        fetchProviderData();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("providerId");
    navigate("/login-provider");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  if (!provider) {
    return <div className="dashboard-error">Failed to load provider data</div>;
  }

  return (
    <div className="provider-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Provider Dashboard</h1>
          <p>Manage your services and profile</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Provider Info Card */}
      <div className="provider-info-card">
        <div className="info-content">
          <h2>{provider.name}</h2>
          <p className="email">{provider.email}</p>
          <p className="phone">📱 {provider.phone}</p>
          <p className="location">📍 {provider.city}, {provider.state} - {provider.pincode}</p>
          <p className="service-type">Service: <strong>{provider.serviceType}</strong></p>
          <p className="price">Price: <strong>₹{provider.price}</strong></p>
          <div className="verification-status">
            {provider.verified ? (
              <span className="verified">✓ Verified Provider</span>
            ) : (
              <span className="unverified">✗ Not Verified</span>
            )}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section">
        <div className="section-header">
          <h2>My Services ({services.length})</h2>
          <button 
            className="add-service-btn"
            onClick={() => setShowAddServiceForm(!showAddServiceForm)}
          >
            <FaPlus /> {showAddServiceForm ? "Cancel" : "Add New Service"}
          </button>
        </div>

        {/* Add Service Form */}
        {showAddServiceForm && (
          <div className="add-service-form">
            <h3>Add New Service</h3>
            <form onSubmit={handleAddService}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <select
                  value={newService.categoryId}
                  onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Service Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows="3"
              />

              <div className="form-row">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newService.city}
                  onChange={(e) => setNewService({ ...newService, city: e.target.value })}
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="State"
                  value={newService.state}
                  onChange={(e) => setNewService({ ...newService, state: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Pincode"
                  value={newService.pincode}
                  onChange={(e) => setNewService({ ...newService, pincode: e.target.value })}
                />
              </div>

              <button type="submit" className="submit-btn">Create Service</button>
            </form>
          </div>
        )}

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-item">
                <div className="service-header">
                  <h4>{service.name}</h4>
                  <span className="category-tag">{service.category?.name}</span>
                </div>

                <p className="service-desc">{service.description}</p>

                <div className="service-meta">
                  <span className="price">₹{service.price}</span>
                  <span className="location">{service.city}, {service.state}</span>
                </div>

                <div className="rating">
                  <FaStar color="#FFD700" /> 
                  <span>{service.rating?.toFixed(1) || "N/A"} ({service.reviewCount || 0})</span>
                </div>

                <div className="service-actions">
                  <button className="edit-btn" onClick={() => setEditingService(service.id)}>
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-services">
            <p>No services yet. Create your first service to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
