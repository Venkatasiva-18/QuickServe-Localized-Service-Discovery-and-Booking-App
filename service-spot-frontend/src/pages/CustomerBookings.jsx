import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerBookings.css";
import { FaClock, FaCalendarAlt, FaUserTie, FaTimesCircle } from "react-icons/fa";

export default function CustomerBookings() {

  const [bookings, setBookings] = useState([]);
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/booking/customer/${customerId}`
      );
      setBookings(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load bookings");
    }
  };

  const cancelBooking = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:8080/booking/cancel/${id}`);
      alert("Booking Cancelled!");
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking!");
    }
  };

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>
      <p>Track, manage and review your service appointments</p>

      <div className="bookings-list">
        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div className="booking-card" key={b.id}>
              
              <div className="booking-header">
                <h3>{b.serviceName}</h3>
                <span className={`status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </div>

              <p><FaUserTie /> Provider ID: {b.providerId}</p>
              <p><FaCalendarAlt /> Date: {b.date}</p>
              <p><FaClock /> Time: {b.time}</p>

              {b.status === "Pending" && (
                <button 
                  className="cancel-btn" 
                  onClick={() => cancelBooking(b.id)}
                >
                  <FaTimesCircle /> Cancel Booking
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
