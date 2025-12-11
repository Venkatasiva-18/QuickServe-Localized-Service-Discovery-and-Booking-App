import React, { useEffect, useState } from "react";
import "./BookService.css";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaRupeeSign,
  FaStar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BookService() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [city, setCity] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read customer ID from localStorage
  const customerId = localStorage.getItem("customerId");

  // Redirect to login if not logged in
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("Please login first.");
      navigate("/login-customer");
    }
  }, []);

  // Fetch all categories and services on load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await initializeDemoDataIfNeeded();
        await fetchCategories();
        await fetchAllServices();
      } catch (err) {
        setError("Failed to load services. Please try again.");
        console.error("Data loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Initialize demo data if no services exist
  const initializeDemoDataIfNeeded = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/services");
      if (!res.data || res.data.length === 0) {
        console.log("No services found. Initializing demo data...");
        const initRes = await axios.post("http://localhost:8080/api/init/demo-data");
        console.log("Demo data initialized!", initRes.data);
        // Small delay to ensure data is persisted
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Service check/initialization error:", error);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch all available services
  const fetchAllServices = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/services");
      setServices(res.data);
      setFilteredServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Filter services by category and city
  const filterServices = () => {
    let filtered = services;

    if (selectedCategory) {
      filtered = filtered.filter(
        (s) => s.category && s.category.id === parseInt(selectedCategory)
      );
    }

    if (city) {
      filtered = filtered.filter((s) =>
        s.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  // Trigger filter when category or city changes
  useEffect(() => {
    filterServices();
  }, [selectedCategory, city]);

  // Book Service
  const handleBooking = async () => {
    if (!bookingDetails.date || !bookingDetails.time || !selectedService) {
      alert("Please fill all details");
      return;
    }

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      return;
    }

    try {
      // Parse date and time into proper formats
      const [hours, minutes] = bookingDetails.time.split(':');
      
      const booking = {
        customer: { id: parseInt(customerId) },
        provider: { id: selectedService.provider.id },
        service: { id: selectedService.id },
        serviceName: selectedService.name,
        bookingDate: bookingDetails.date,
        bookingTime: bookingDetails.time,
        status: "Pending"
      };

      const response = await axios.post("http://localhost:8080/booking/create", booking);

      alert("Booking Successful!");
      navigate("/customer-bookings");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed: " + (error.response?.data?.error || error.message));
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchCategories();
      await fetchAllServices();
    } catch (err) {
      setError("Failed to refresh services");
      console.error("Refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-container">
      <div className="book-header">
        <h2>Book a Service</h2>
        <p>Find trusted professionals and schedule your appointment</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Loading services...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
      {/* Search Inputs with Category Dropdown */}
      <div className="book-search">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-dropdown"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="City (Hyderabad, Mumbai...)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Services List */}
      <div className="services-header">
        <h3>Available Services ({filteredServices.length})</h3>
      </div>

      <div className="services-grid">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              className={`service-card ${
                selectedService?.id === service.id ? "selected" : ""
              }`}
              key={service.id}
              onClick={() => setSelectedService(service)}
            >
              <div className="service-header">
                <h4>{service.name}</h4>
                <span className="category-badge">{service.category?.name}</span>
              </div>

              <p className="service-description">{service.description}</p>

              <div className="service-details">
                <p className="location">
                  📍 {service.city}, {service.state}
                </p>
                <p className="price">
                  <FaRupeeSign /> {service.price}
                </p>
              </div>

              <div className="service-rating">
                <FaStar color="#FFD700" /> {service.rating?.toFixed(1) || "N/A"} 
                ({service.reviewCount || 0} reviews)
              </div>

              <div className="provider-info">
                <FaUserTie /> <strong>{service.provider?.name}</strong>
              </div>
            </div>
          ))
        ) : (
          <p className="no-services">No services found. Try different filters.</p>
        )}
      </div>

      {/* Booking Form */}
      {selectedService && (
        <div className="booking-box">
          <h3>Confirm Booking - {selectedService.name}</h3>
          <p>Provider: <strong>{selectedService.provider?.name}</strong></p>

          <label>
            <FaCalendarAlt /> Select Date:
            <input
              type="date"
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, date: e.target.value })
              }
            />
          </label>

          <label>
            <FaClock /> Select Time:
            <input
              type="time"
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, time: e.target.value })
              }
            />
          </label>

          <button className="confirm-btn" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
}
