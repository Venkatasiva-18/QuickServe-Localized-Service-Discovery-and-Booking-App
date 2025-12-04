import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {

  const navigate = useNavigate();
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("role");

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // fetch services (later connected to backend)
  useEffect(() => {
    fetch("http://localhost:8080/api/services")
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(() => console.log("Error fetching services"));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setFiltered([]);
      return;
    }

    const match = services.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(match);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${search}`);
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">

      {/* LEFT → LOGO */}
      <div className="navbar-left">
        <h2 className="logo">Service<span>Spot</span></h2>

      </div>

      {/* CENTER → SEARCH BOX */}
      <div className="navbar-center">
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search services…"
            value={search}
            onChange={handleSearchChange}
          />

          {filtered.length > 0 && (
            <ul className="dropdown">
              {filtered.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearch(item);
                    setFiltered([]);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      {/* RIGHT → MENUS */}
      <div className="navbar-right">
        <ul className="nav-links">

          <li><Link to="/">Home</Link></li>

          {/* BEFORE LOGIN */}
          {!loggedIn && (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/contact-help">Contact & Help</Link></li>
            </>
          )}

          {/* AFTER LOGIN → CUSTOMER */}
          {loggedIn && role === "customer" && (
            <>
              <li><Link to="/customer-profile">View Profile</Link></li>
              <li><Link to="/customer-update">Update Details</Link></li>
              <li><Link to="/contact-help">Contact & Help</Link></li>
            </>
          )}

          {/* AFTER LOGIN → PROVIDER */}
          {loggedIn && role === "provider" && (
            <>
              <li><Link to="/provider-profile">View Profile</Link></li>
              <li><Link to="/provider-update">Update Details</Link></li>
              <li><Link to="/map">Map View</Link></li>
              <li><Link to="/contact-help">Contact & Help</Link></li>
            </>
          )}

          {/* AFTER LOGIN → ADMIN */}
          {loggedIn && role === "admin" && (
            <>
              <li><Link to="/admin-dashboard">Dashboard</Link></li>
              <li><Link to="/admin-customers">Customers</Link></li>
              <li><Link to="/admin-providers">Providers</Link></li>
            </>
          )}

        </ul>

        {loggedIn && (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
