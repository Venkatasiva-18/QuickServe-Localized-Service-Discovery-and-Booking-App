import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResults.css";

export default function SearchResults() {
  
  const location = useLocation();
  const navigate = useNavigate();

  const service = new URLSearchParams(location.search).get("service") || "";
  const area = new URLSearchParams(location.search).get("area") || "";
  const city = new URLSearchParams(location.search).get("city") || "";

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBookNow = (provider) => {
    if (!localStorage.getItem("loggedIn")) {
      alert("Please login as a customer to book a service.");
      navigate("/login-customer");
      return;
    }
    
    navigate("/book-service", { 
      state: { preSelectedService: provider, searchCity: city }
    });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (service.trim()) searchParams.append('service', service);
    if (area.trim()) searchParams.append('area', area);
    if (city.trim()) searchParams.append('city', city);

    const queryString = searchParams.toString();
    const url = `http://localhost:8080/api/search${queryString ? '?' + queryString : ''}`;
    
    console.log("Fetching from:", url);
    
    fetch(url)
      .then(res => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch search results`);
        return res.json();
      })
      .then(data => {
        console.log("Received data:", data);
        setProviders(Array.isArray(data) ? data : []);
        setError(null);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading search data:", error);
        setError(`Error: ${error.message}. Make sure the backend server is running on port 8080.`);
        setProviders([]);
        setLoading(false);
      });
  }, [service, area, city]);

  return (
    <div className="results-container">
      <div className="results-hero">
        <span>Curated matches</span>
        <h1>Professionals tailored to your filters</h1>
        <p>Reach out to trusted providers and get instant callbacks.</p>
      </div>

      <div className="query-tags">
        <span className="query-pill">Service: {service || "Any"}</span>
        <span className="query-pill">Area: {area || "Any"}</span>
        <span className="query-pill">City: {city || "Any"}</span>
      </div>

      {loading && (
        <p className="loading-state">Loading providers...</p>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <p>Please make sure the backend server is running on port 8080.</p>
        </div>
      )}

      {!loading && !error && providers.length === 0 && (
        <p className="no-results">No providers found for the selected filters.</p>
      )}

      {!loading && !error && providers.length > 0 && (
        <div className="results-grid">
          {providers.map((p, index) => (
            <article className="result-card" key={`${p.name}-${index}`}>
              <div className="result-card-header">
                <div>
                  <h2>{p.name}</h2>
                  <p className="result-subtitle">Trusted specialist ready to support you</p>
                </div>
                <span className="service-chip">{p.serviceType || "Service"}</span>
              </div>

              <div className="result-details">
                <div>
                  <label>Area</label>
                  <p>{p.addressLine || "Not available"}</p>
                </div>
                <div>
                  <label>City</label>
                  <p>{p.city || "Not available"}</p>
                </div>
                <div>
                  <label>Price</label>
                  <p>{p.price ? `₹${p.price}` : "Price on request"}</p>
                </div>
              </div>

              <div className="result-card-footer">
                <span className="price-tag">{p.price ? `₹${p.price}` : "Price on request"}</span>
                <button type="button" onClick={() => handleBookNow(p)}>Book Now</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
