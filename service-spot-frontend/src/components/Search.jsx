import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

export default function Search() {

  const [service, setService] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/search?service=${service}&area=${area}&city=${city}`
    );
  };

  return (
    <form className="search-box" onSubmit={handleSearch}>
      <div className="search-header">
        <p>Instantly match with verified pros near you</p>
        <h3>Find the help you need in seconds</h3>
      </div>

      <div className="search-grid">
        <label className="search-field">
          <span>Service Type</span>
          <input
            type="text"
            placeholder="Electrician, Plumber, Cleaner"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </label>

        <label className="search-field">
          <span>Area / Locality</span>
          <input
            type="text"
            placeholder="Eg. Jubilee Hills"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </label>

        <label className="search-field">
          <span>City</span>
          <input
            type="text"
            placeholder="Eg. Hyderabad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="search-submit">Search Services</button>
    </form>
  );
}
