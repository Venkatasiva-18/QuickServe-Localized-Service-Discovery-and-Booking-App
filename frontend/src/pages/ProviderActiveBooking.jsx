import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./ProviderActiveBooking.css";

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function ProviderActiveBooking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([17.3850, 78.4867]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoShare, setAutoShare] = useState(false);

  const fetchBookingData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/booking/${bookingId}`);
      if (!response.ok) throw new Error("Booking not found");
      const data = await response.json();
      setBookingData(data);
      setLoading(false);

      if (data.providerLatitude && data.providerLongitude) {
        setMapCenter([data.providerLatitude, data.providerLongitude]);
        setSelectedLocation([data.providerLatitude, data.providerLongitude]);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const shareLocation = async (lat, lng) => {
    try {
      setSharing(true);
      const response = await fetch(
        `http://localhost:8080/booking/${bookingId}/update-location`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lng }),
        }
      );

      if (!response.ok) throw new Error("Failed to share location");

      setSelectedLocation([lat, lng]);
      setLastUpdate(new Date());
      setError(null);
      alert("✓ Location shared successfully!");
    } catch (err) {
      setError(err.message);
      alert(`✗ Error: ${err.message}`);
    } finally {
      setSharing(false);
    }
  };

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        shareLocation(latitude, longitude);
      },
      (err) => {
        setError(`Geolocation error: ${err.message}`);
      }
    );
  };

  const handleMapClick = async (location) => {
    setSelectedLocation(location);
    await shareLocation(location[0], location[1]);
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  useEffect(() => {
    if (!autoShare) return;

    const interval = setInterval(() => {
      getCurrentPosition();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoShare, bookingId]);

  if (loading) {
    return (
      <div className="provider-active-container">
        <div className="loading">Loading booking...</div>
      </div>
    );
  }

  if (error && !bookingData) {
    return (
      <div className="provider-active-container">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isActive = bookingData?.status === "Accepted" || bookingData?.status === "In Progress";

  return (
    <div className="provider-active-container">
      <div className="active-header">
        <h1>📍 Share Your Location</h1>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      <div className="active-content">
        <div className="booking-panel">
          <div className="section">
            <h2>Booking Details</h2>
            <div className="info-group">
              <span className="label">Booking ID:</span>
              <span className="value">#{bookingData?.id}</span>
            </div>
            <div className="info-group">
              <span className="label">Service:</span>
              <span className="value">{bookingData?.serviceName}</span>
            </div>
            <div className="info-group">
              <span className="label">Status:</span>
              <span className={`status-badge ${bookingData?.status.toLowerCase()}`}>
                {bookingData?.status}
              </span>
            </div>
            <div className="info-group">
              <span className="label">Customer:</span>
              <span className="value">{bookingData?.customerName}</span>
            </div>
          </div>

          {isActive ? (
            <>
              <div className="section">
                <h2>Share Location</h2>
                <p className="section-description">
                  Click on the map to mark your current location or use the buttons below.
                </p>

                <div className="location-buttons">
                  <button
                    onClick={getCurrentPosition}
                    disabled={sharing}
                    className="btn-primary"
                  >
                    📍 {sharing ? "Sharing..." : "Share Current Location"}
                  </button>
                  <button
                    onClick={() => setAutoShare(!autoShare)}
                    className={`btn-secondary ${autoShare ? "active" : ""}`}
                  >
                    {autoShare ? "⏸ Stop Auto-Share" : "▶ Auto-Share (10s)"}
                  </button>
                </div>

                {lastUpdate && (
                  <div className="last-update">
                    ✓ Last shared: {lastUpdate.toLocaleTimeString()}
                  </div>
                )}

                {error && <div className="error-message">{error}</div>}

                {selectedLocation && (
                  <div className="location-display">
                    <div className="coord">
                      <span className="label">Latitude:</span>
                      <span className="value">{selectedLocation[0].toFixed(6)}</span>
                    </div>
                    <div className="coord">
                      <span className="label">Longitude:</span>
                      <span className="value">{selectedLocation[1].toFixed(6)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="section tips">
                <h3>💡 Tips</h3>
                <ul>
                  <li>Click on the map to manually set your location</li>
                  <li>Use "Share Current Location" to auto-detect via GPS</li>
                  <li>Enable "Auto-Share" to update location every 10 seconds</li>
                  <li>Make sure location services are enabled on your device</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="section inactive-message">
              <p>✗ Location sharing not available</p>
              <p>Only for <strong>Accepted</strong> or <strong>In Progress</strong> bookings</p>
              <p className="current-status">Current Status: <strong>{bookingData?.status}</strong></p>
            </div>
          )}
        </div>

        <div className="map-panel">
          <h2>Map</h2>
          {isActive ? (
            <MapContainer
              center={mapCenter}
              zoom={15}
              scrollWheelZoom={true}
              dragging={true}
              className="active-map"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {selectedLocation && (
                <Marker position={selectedLocation}>
                  <Popup>
                    <div className="marker-popup">
                      <p className="marker-title">Your Current Location</p>
                      <p className="marker-coords">
                        {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
              <MapClickHandler onLocationSelect={handleMapClick} />
            </MapContainer>
          ) : (
            <div className="map-inactive">
              <p>Map not available</p>
              <p className="sub-text">Please accept the booking to start sharing location</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
