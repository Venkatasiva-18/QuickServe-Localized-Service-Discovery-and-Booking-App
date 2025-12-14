import React, { useEffect, useState } from "react";
import "./BookService.css";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaRupeeSign,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowLeft
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function BookService() {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [city, setCity] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [inactiveServices, setInactiveServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState("");
  
  // Search context from navigation state
  const [searchContext, setSearchContext] = useState({
    service: "",
    area: "",
    city: ""
  });

  // Read customer ID from localStorage
  const customerId = localStorage.getItem("customerId");

  // Extract search context and handle login redirect
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("Please login first.");
      navigate("/login-customer");
    }
    
    // Extract search context from navigation state
    if (location.state?.searchContext) {
      setSearchContext(location.state.searchContext);
      // Pre-populate city field if available
      if (location.state.searchContext.city) {
        setCity(location.state.searchContext.city);
      }
    }
    
    // Pre-select service if coming from search results (service or provider)
    if (location.state?.preSelectedService) {
      const preSelected = location.state.preSelectedService;
      console.log("Pre-selected from search:", preSelected);
      
      if (preSelected.provider) {
        setSelectedService(preSelected);
      } else if (preSelected.serviceId) {
        preSelected.id = preSelected.serviceId;
        setSelectedService(preSelected);
      } else if (preSelected.name && !preSelected.category) {
        localStorage.setItem("selectedProviderId", preSelected.id);
        if (preSelected.city) {
          setCity(preSelected.city);
        }
      }
    }
  }, []);

  // Fetch all categories and services on load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Starting to load services...");
        await initializeDemoDataIfNeeded();
        console.log("Demo data initialized");
        await fetchCategories();
        console.log("Categories fetched");
        await fetchAllServices();
        console.log("Services fetched");
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
      console.log("All services API response:", res.data);
      console.log("Services count:", res.data?.length || 0);
      
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach((s, idx) => {
          console.log(`Service ${idx}:`, {
            id: s.id,
            name: s.name,
            provider: s.provider ? {id: s.provider.id, name: s.provider.name} : null
          });
        });
      }
      
      setServices(res.data || []);
      setFilteredServices(res.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
      setFilteredServices([]);
    }
  };

  // Filter services by category and city
  const filterServices = () => {
    let filtered = services;

    const selectedProviderId = localStorage.getItem("selectedProviderId");
    if (selectedProviderId) {
      filtered = filtered.filter((s) =>
        s.provider?.id === parseInt(selectedProviderId)
      );
    }

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

    if (serviceName) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(serviceName.toLowerCase())
      );
    }

    setFilteredServices(filtered);
    
    // Separate active and inactive providers
    const active = filtered.filter(s => s.provider?.verified !== false);
    const inactive = filtered.filter(s => s.provider?.verified === false);
    
    setServices(active);
    setInactiveServices(inactive);
  };

  // Trigger filter when category, city, or service name changes
  useEffect(() => {
    filterServices();
  }, [selectedCategory, city, serviceName]);

  const handleBooking = async () => {
    if (!bookingDetails.date || !bookingDetails.time || !selectedService) {
      alert("Please fill all details");
      return;
    }

    if (!customerId) {
      alert("Customer ID not found. Please login again.");
      return;
    }

    const providerId = selectedService.provider?.id || selectedService.providerId;
    if (!providerId) {
      alert("Service provider information is missing. Please select another service.");
      return;
    }

    try {
      const booking = {
        customerId: parseInt(customerId),
        providerId: providerId,
        serviceId: selectedService.id || selectedService.serviceId,
        serviceName: selectedService.name,
        bookingDate: bookingDetails.date,
        bookingTime: bookingDetails.time,
        status: "Pending",
        notes: "",
        totalAmount: selectedService.price || 0
      };

      console.log("Sending booking:", booking);

      const response = await axios.post("http://localhost:8080/booking/create", booking);
      
      console.log("Booking response:", response.data);
      alert("Booking Successful!");
      localStorage.removeItem("selectedProviderId");
      navigate("/customer-bookings");
    } catch (error) {
      console.error("Booking error:", error);
      const errorMsg = error.response?.data || error.message;
      console.error("Error details:", errorMsg);
      alert("Booking failed: " + (typeof errorMsg === 'string' ? errorMsg : errorMsg.error || JSON.stringify(errorMsg)));
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

      {/* Search Context Breadcrumb */}
      {(searchContext.service || searchContext.area || searchContext.city) && (
        <div className="search-context-breadcrumb">
          <button 
            className="back-to-search-btn"
            onClick={() => navigate("/search")}
          >
            <FaArrowLeft /> Back to Search
          </button>
          <div className="context-info">
            <span className="context-label">You searched for:</span>
            {searchContext.service && <span className="context-tag">{searchContext.service}</span>}
            {searchContext.area && <span className="context-tag">{searchContext.area}</span>}
            {searchContext.city && <span className="context-tag">{searchContext.city}</span>}
          </div>
        </div>
      )}

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
      <div className="book-search-container">
        <div className="book-search">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-dropdown"
            title="Filter by service category"
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
            placeholder="Service Name (e.g., Plumbing, Electrical...)"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            title="Search by service name"
            className="service-name-input"
          />

          <input
            type="text"
            placeholder="City (Hyderabad, Mumbai...)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            title="Filter by city"
            className="city-input"
          />
        </div>

        {searchError && (
          <div className="search-error-message">{searchError}</div>
        )}
      </div>

      {/* Active Services List */}
      <div className="services-header">
        <h3>Active Service Providers ({services.length})</h3>
      </div>

      <div className="services-grid">
        {services.length > 0 ? (
          services.map((service) => (
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
                {service.provider?.verified && <span className="verified-badge">✓ Verified</span>}
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

              <div className="provider-info-section">
                <div className="provider-header-card">
                  {service.provider?.profileImage ? (
                    <img src={service.provider.profileImage} alt={service.provider.name} className="provider-avatar-small" />
                  ) : (
                    <div className="provider-avatar-placeholder">
                      <FaUserTie />
                    </div>
                  )}
                  <strong>{service.provider?.name}</strong>
                </div>
                
                <div className="provider-contact">
                  {service.provider?.phone && (
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span>{service.provider.phone}</span>
                    </div>
                  )}
                  {service.provider?.email && (
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <span>{service.provider.email}</span>
                    </div>
                  )}
                  {service.city && (
                    <div className="contact-item">
                      <FaMapMarkerAlt className="contact-icon" />
                      <span>{service.city}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                className="book-now-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedService(service);
                  setTimeout(() => {
                    document.querySelector('.booking-box')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="no-services">No active services found.</p>
        )}
      </div>

      {/* Inactive Service Providers Section */}
      {inactiveServices.length > 0 && (
        <div className="inactive-services-section">
          <div className="inactive-header">
            <h3>📋 Inactive Service Providers ({inactiveServices.length})</h3>
            <p className="inactive-note">These providers are currently inactive or unverified. Contact them for availability.</p>
          </div>
          
          <div className="services-grid">
            {inactiveServices.map((service) => (
              <div
                className={`service-card inactive-service-card ${
                  selectedService?.id === service.id ? "selected" : ""
                }`}
                key={service.id}
                onClick={() => setSelectedService(service)}
              >
                <div className="service-header">
                  <h4>{service.name}</h4>
                  <span className="category-badge">{service.category?.name}</span>
                  <span className="inactive-badge">⚠ Inactive</span>
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

                <div className="provider-info-section">
                  <div className="provider-header-card">
                    {service.provider?.profileImage ? (
                      <img src={service.provider.profileImage} alt={service.provider.name} className="provider-avatar-small" />
                    ) : (
                      <div className="provider-avatar-placeholder">
                        <FaUserTie />
                      </div>
                    )}
                    <strong>{service.provider?.name}</strong>
                  </div>
                  
                  <div className="provider-contact">
                    {service.provider?.phone && (
                      <div className="contact-item">
                        <FaPhone className="contact-icon" />
                        <span>{service.provider.phone}</span>
                      </div>
                    )}
                    {service.provider?.email && (
                      <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <span>{service.provider.email}</span>
                      </div>
                    )}
                    {service.city && (
                      <div className="contact-item">
                        <FaMapMarkerAlt className="contact-icon" />
                        <span>{service.city}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  className="book-now-btn inactive-book-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                    setTimeout(() => {
                      document.querySelector('.booking-box')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  disabled
                  title="This provider is inactive"
                >
                  Provider Inactive
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && inactiveServices.length === 0 && (
        <p className="no-services">No services found. Try different filters or search terms.</p>
      )}

      {/* No Provider Warning */}
      {selectedService && !selectedService.provider && (
        <div className="error-state">
          <p>This service does not have provider information. Please select another service.</p>
        </div>
      )}

      {/* Booking Form */}
      {selectedService && selectedService.provider && (
        <div className="booking-box">
          <h3>Confirm Booking - {selectedService.name}</h3>
          
          <div className="booking-provider-section">
            <h4>Provider Details</h4>
            <div className="booking-provider-card">
              <div className="provider-name-box">
                {selectedService.provider?.profileImage ? (
                  <img src={selectedService.provider.profileImage} alt={selectedService.provider.name} className="provider-avatar-medium" />
                ) : (
                  <div className="provider-avatar-placeholder-medium">
                    <FaUserTie />
                  </div>
                )}
                <strong>{selectedService.provider?.name}</strong>
              </div>
              
              <div className="booking-provider-contacts">
                {selectedService.provider?.phone && (
                  <div className="booking-contact-item">
                    <FaPhone className="contact-icon" />
                    <div>
                      <label>Phone</label>
                      <p>{selectedService.provider.phone}</p>
                    </div>
                  </div>
                )}
                {selectedService.provider?.email && (
                  <div className="booking-contact-item">
                    <FaEnvelope className="contact-icon" />
                    <div>
                      <label>Email</label>
                      <p>{selectedService.provider.email}</p>
                    </div>
                  </div>
                )}
                {selectedService.addressLine && (
                  <div className="booking-contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <div>
                      <label>Address</label>
                      <p>{selectedService.addressLine || selectedService.city}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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
