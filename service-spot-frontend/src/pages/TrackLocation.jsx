import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function TrackLocation() {
  const providerId = localStorage.getItem("trackingProviderId"); 
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  const fetchLocation = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/provider/location/${providerId}`
      );
      setLocation(res.data);
      setError("");
    } catch (err) {
      setError("Waiting for provider location...");
    }
  };

  useEffect(() => {
    if (!providerId) {
      setError("Provider not accepted yet");
      return;
    }

    fetchLocation();
    intervalRef.current = setInterval(fetchLocation, 3000); // 🔁 every 3 sec

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>📍 Live Service Tracking</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {location && (
        <div>
          <p><b>Latitude:</b> {location.latitude}</p>
          <p><b>Longitude:</b> {location.longitude}</p>
          <p><b>Last Updated:</b> {new Date(location.updatedAt).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}
