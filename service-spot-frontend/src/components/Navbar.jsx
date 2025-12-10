import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("role");

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Hide Logout on login pages
  const loginPages = [
    "/login",
    "/login-customer",
    "/login-provider",
    "/login-admin"
  ];

  // Load static service list
  useEffect(() => {
    setServices([
      "Electrician",
      "Plumber",
      "Mechanic",
      "Gardening",
      "Painter",
      "Home Cleaning"
    ]);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    if (!val.trim()) {
      setFiltered([]);
      return;
    }

    setFiltered(
      services.filter(s => s.toLowerCase().includes(val.toLowerCase()))
    );
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2 className="logo">Service<span>Spot</span></h2>
      </div>

      {/* Search Bar */}
      <div className="navbar-center">
        <form className="navbar-search">
          <FaSearch className="search-icon" />

          <input 
            type="text"
            placeholder="Search services…"
            value={search}
            onChange={handleSearchChange}
          />

          {filtered.length > 0 && (
            <ul className="dropdown">
              {filtered.map((item, i) => (
                <li key={i} onClick={() => { setSearch(item); setFiltered([]); }}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">

          <li><Link to="/">Home</Link></li>

          {!loggedIn && (
            <>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}

          {loggedIn && role === "customer" && (
            <>
              <li><Link to="/customer-dashboard">Dashboard</Link></li>
              <li><Link to="/customer-profile">Profile</Link></li>
            </>
          )}
        </ul>

        {/* ⭐ Hide logout on login pages */}
        {loggedIn && !loginPages.includes(location.pathname) && (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}

      </div>
    </nav>
  );
}
