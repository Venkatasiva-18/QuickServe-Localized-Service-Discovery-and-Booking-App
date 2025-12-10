import React, { useEffect, useState } from "react";
import "./BookService.css";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaRupeeSign
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BookService() {
  const navigate = useNavigate();

  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
  });

  // Read customer ID from localStorage
  const customerId = localStorage.getItem("customerId");

  // Redirect to login if not logged in
  useEffect(() => {
    if (!localStorage.getItem("loggedIn")) {
      alert("Please login first.");
      navigate("/login-customer");
    }
  }, []);

  // Search Providers
  const searchProviders = async () => {
    if (!service || !city) {
      alert("Please enter service and city");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/provider/search?service=${service}&city=${city}`
      );
      setProviders(res.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching providers");
    }
  };

  // Book Service
  const handleBooking = async () => {
    if (!bookingDetails.date || !bookingDetails.time || !selectedProvider) {
      alert("Please fill all details");
      return;
    }

    const booking = {
      customerId,
      providerId: selectedProvider.id,
      serviceName: selectedProvider.serviceType,
      date: bookingDetails.date,
      time: bookingDetails.time,
    };

    try {
      await axios.post("http://localhost:8080/booking/create", booking);

      alert("Booking Successful!");
      navigate("/customer-bookings"); // ✅ FIXED (NO WHITE PAGE)
    } catch (error) {
      console.error(error);
      alert("Booking failed!");
    }
  };

  return (
    <div className="book-container">
      <div className="book-header">
        <h2>Book a Service</h2>
        <p>Find trusted professionals and schedule your appointment</p>
      </div>

      {/* Search Inputs */}
      <div className="book-search">
        <input
          type="text"
          placeholder="Service Type (Electrician, Plumber...)"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <input
          type="text"
          placeholder="City (Hyderabad, Mumbai...)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={searchProviders}>Search</button>
      </div>

      {/* Provider Cards */}
      <div className="provider-list">
        {providers.map((p) => (
          <div
            className={`provider-card ${
              selectedProvider?.id === p.id ? "selected" : ""
            }`}
            key={p.id}
            onClick={() => setSelectedProvider(p)}
          >
            <h4>
              <FaUserTie /> {p.name}
            </h4>
            <p>Service: {p.serviceType}</p>
            <p>
              <FaRupeeSign /> {p.approxPrice}
            </p>
            <p>Experience: {p.experience} years</p>
          </div>
        ))}
      </div>

      {/* Booking Form */}
      {selectedProvider && (
        <div className="booking-box">
          <h3>Confirm Booking with {selectedProvider.name}</h3>

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
    </div>
  );
}
