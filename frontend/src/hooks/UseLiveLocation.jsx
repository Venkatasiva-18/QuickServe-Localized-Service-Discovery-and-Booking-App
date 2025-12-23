import { useEffect } from "react";
import axios from "axios";

export default function useLiveLocation(providerId) {

  useEffect(() => {
    if (!providerId) return;

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const sendLocation = (position) => {
      const { latitude, longitude } = position.coords;

      axios.post(
        `http://localhost:8080/api/provider/location/${providerId}`,
        null,
        {
          params: {
            latitude,
            longitude
          }
        }
      ).catch(err => {
        console.error("Location update failed", err);
      });
    };

    const errorHandler = (error) => {
      console.error("GPS error:", error.message);
    };

    // 🔥 REAL-TIME tracking
    const watchId = navigator.geolocation.watchPosition(
      sendLocation,
      errorHandler,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [providerId]);
}
