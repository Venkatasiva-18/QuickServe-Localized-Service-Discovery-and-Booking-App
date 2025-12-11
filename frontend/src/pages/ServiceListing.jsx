import React, { useState, useEffect } from "react";
import "./ServiceListing.css";
import { FaStar, FaMapMarkerAlt, FaIndianRupee } from "react-icons/fa";

export default function ServiceListing() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    if (city) {
      fetchServices();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/category");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8080/api/services";

      if (searchKeyword && city) {
        url = `http://localhost:8080/api/services/search?keyword=${searchKeyword}&city=${city}`;
      } else if (selectedCategory && city) {
        url = `http://localhost:8080/api/services/location/${city}/Andhra%20Pradesh/category/${selectedCategory}`;
      } else if (city) {
        url = `http://localhost:8080/api/services/location/${city}/Andhra%20Pradesh`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setServices(data);
      sortServices(data, sortBy);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortServices = (servicesToSort, criteria) => {
    let sorted = [...servicesToSort];
    switch (criteria) {
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "reviews":
        sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        break;
    }
    setFilteredServices(sorted);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    sortServices(services, e.target.value);
  };

  return (
    <div className="service-listing-container">
      <div className="search-filter-section">
        <h2>Find Services Near You</h2>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Search Services</label>
            <input
              type="text"
              placeholder="Search service name..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <div className="sort-section">
          <label>Sort By:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      </div>

      <div className="services-grid">
        {loading ? (
          <p>Loading services...</p>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <div className="rating-badge">
                  <FaStar className="star-icon" />
                  <span>{service.rating ? service.rating.toFixed(1) : "0"}</span>
                </div>
              </div>

              <p className="service-description">{service.description}</p>

              <div className="service-details">
                <div className="detail-item">
                  <FaMapMarkerAlt /> {service.city}, {service.state}
                </div>
                <div className="detail-item reviews">
                  {service.reviewCount || 0} reviews
                </div>
              </div>

              <div className="service-price">
                <FaIndianRupee /> {service.price}
              </div>

              <div className="service-actions">
                <button className="view-btn">View Details</button>
                <button className="compare-btn">Compare</button>
              </div>
            </div>
          ))
        ) : (
          <p>No services found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
}
