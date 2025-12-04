import React, { useEffect, useState } from "react";
import "./AdminProviders.css";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function AdminProviders() {

  const [providers, setProviders] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/providers")
      .then(res => res.json())
      .then(data => {
        setProviders(data);
        setFiltered(data);
      })
      .catch(() => console.log("Error fetching providers"));
  }, []);

  // Search provider
  const handleSearch = (value) => {
    const text = value.toLowerCase();
    const result = providers.filter(p =>
      p.name.toLowerCase().includes(text) ||
      p.email.toLowerCase().includes(text) ||
      p.mobile.includes(text) ||
      p.serviceType.toLowerCase().includes(text) ||
      p.city.toLowerCase().includes(text)
    );
    setFiltered(result);
  };

  // Verify provider
  const verifyProvider = (id) => {
    fetch(`http://localhost:8080/api/admin/providers/verify/${id}`, {
      method: "PUT"
    });
    alert("Provider Verified");
    window.location.reload();
  };

  // Unverify provider
  const unverifyProvider = (id) => {
    fetch(`http://localhost:8080/api/admin/providers/unverify/${id}`, {
      method: "PUT"
    });
    alert("Provider Unverified");
    window.location.reload();
  };

  return (
    <div className="admin-providers-container">
      <h1>Providers Management</h1>

      {/* Search */}
      <div className="provider-search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search providers..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <table className="provider-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Service Type</th>
            <th>Price (₹)</th>
            <th>City</th>
            <th>Pincode</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No Providers Found
              </td>
            </tr>
          ) : (
            filtered.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.mobile}</td>
                <td>{p.serviceType}</td>
                <td>{p.price}</td>
                <td>{p.city}</td>
                <td>{p.pincode}</td>

                <td>
                  {p.verified ? (
                    <span className="verified"><FaCheckCircle /> Verified</span>
                  ) : (
                    <span className="unverified"><FaTimesCircle /> Unverified</span>
                  )}
                </td>

                <td>
                  {p.verified ? (
                    <button className="unverify-btn" onClick={() => unverifyProvider(p.id)}>
                      Unverify
                    </button>
                  ) : (
                    <button className="verify-btn" onClick={() => verifyProvider(p.id)}>
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}
