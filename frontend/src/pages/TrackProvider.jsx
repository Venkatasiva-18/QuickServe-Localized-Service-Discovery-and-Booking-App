import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TrackProvider.css";

export default function TrackProvider() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLocationData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/booking/${bookingId}/location`);
      if (!response.ok) {
        throw new Error("Failed to fetch location");
      }
      const data = await response.json();
      setLocationData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching location:", err);
      setError(err.message);
    }
  };

  const fetchBookingData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/booking/${bookingId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch booking");
      }
      const data = await response.json();
      setBookingData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
    fetchLocationData();
  }, [bookingId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLocationData();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, bookingId]);

  if (loading) {
    return (
      <div className="track-provider-container">
        <div className="loading">Loading booking details...</div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="track-provider-container">
        <div className="error">
          <p>Error: {error || "Booking not found"}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const mapCenter = locationData?.latitude && locationData?.longitude
    ? [locationData.latitude, locationData.longitude]
    : [17.3850, 78.4867];

  const isActive = bookingData.status === "Accepted" || bookingData.status === "In Progress";

  return (
    <div className="track-provider-container">
      <div className="track-header">
        <h1>📍 Track Provider Location</h1>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      <div className="track-content">
        <div className="booking-details">
          <div className="section">
            <h2>Booking Information</h2>
            <div className="info-group">
              <span className="label">Booking ID:</span>
              <span className="value">#{bookingData.id}</span>
            </div>
            <div className="info-group">
              <span className="label">Service:</span>
              <span className="value">{bookingData.serviceName}</span>
            </div>
            <div className="info-group">
              <span className="label">Status:</span>
              <span className={`status-badge ${bookingData.status.toLowerCase()}`}>
                {bookingData.status}
              </span>
            </div>
            <div className="info-group">
              <span className="label">Date & Time:</span>
              <span className="value">
                {bookingData.date} at {bookingData.time}
              </span>
            </div>
            <div className="info-group">
              <span className="label">Amount:</span>
              <span className="value">₹{bookingData.totalAmount}</span>
            </div>
          </div>

          <div className="section">
            <h2>Provider Information</h2>
            {bookingData.customerProfileImage && (
              <div className="provider-image">
                <img src={bookingData.providerProfileImage} alt="Provider" />
              </div>
            )}
            <div className="info-group">
              <span className="label">Name:</span>
              <span className="value">{bookingData.providerName}</span>
            </div>
            <div className="info-group">
              <span className="label">Phone:</span>
              <span className="value">
                <a href={`tel:${bookingData.providerPhone}`}>
                  {bookingData.providerPhone}
                </a>
              </span>
            </div>
            <div className="info-group">
              <span className="label">Email:</span>
              <span className="value">
                <a href={`mailto:${bookingData.providerEmail}`}>
                  {bookingData.providerEmail}
                </a>
              </span>
            </div>
          </div>

          {isActive && locationData && (
            <div className="section">
              <h2>Live Location</h2>
              <div className="info-group">
                <span className="label">Latitude:</span>
                <span className="value">
                  {locationData.latitude ? locationData.latitude.toFixed(4) : "N/A"}
                </span>
              </div>
              <div className="info-group">
                <span className="label">Longitude:</span>
                <span className="value">
                  {locationData.longitude ? locationData.longitude.toFixed(4) : "N/A"}
                </span>
              </div>
              <div className="info-group">
                <span className="label">Last Update:</span>
                <span className="value">
                  {locationData.lastUpdate
                    ? new Date(locationData.lastUpdate).toLocaleTimeString()
                    : "No updates yet"}
                </span>
              </div>
              <div className="refresh-controls">
                <label className="auto-refresh">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  Auto-refresh (every 5 seconds)
                </label>
                <button onClick={fetchLocationData} className="refresh-btn">
                  🔄 Refresh Now
                </button>
              </div>
            </div>
          )}

          {!isActive && (
            <div className="section inactive-message">
              <p>Location tracking is only available for active bookings.</p>
              <p>Current Status: <strong>{bookingData.status}</strong></p>
            </div>
          )}
        </div>

        <div className="map-section">
          {isActive && locationData?.latitude && locationData?.longitude ? (
            <>
              <div className="map-header">
                <h2>Provider Location Map</h2>
                <span className="live-indicator">● Live</span>
              </div>
              <MapContainer
                center={mapCenter}
                zoom={15}
                scrollWheelZoom={true}
                dragging={true}
                className="track-map"
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[locationData.latitude, locationData.longitude]}>
                  <Popup>
                    <div className="marker-popup">
                      <p className="marker-title">{bookingData.providerName}</p>
                      <p className="marker-service">{bookingData.serviceName}</p>
                      <p className="marker-coords">
                        {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </>
          ) : (
            <div className="no-location">
              <p>📍 No location data available yet</p>
              <p className="sub-text">
                {isActive
                  ? "Waiting for provider to share location..."
                  : "Location tracking is not available for this booking status"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
