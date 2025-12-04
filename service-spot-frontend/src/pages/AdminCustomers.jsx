import React, { useEffect, useState } from "react";
import "./AdminCustomers.css";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function AdminCustomers() {

  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Fetch all customers from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/admin/customers")
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setFiltered(data);
      })
      .catch(() => console.log("Error fetching customers"));
  }, []);

  // Search filter
  const handleSearch = (value) => {
    const searchText = value.toLowerCase();
    const result = customers.filter(c =>
      c.name.toLowerCase().includes(searchText) ||
      c.email.toLowerCase().includes(searchText) ||
      c.mobile.includes(searchText) ||
      c.city.toLowerCase().includes(searchText)
    );
    setFiltered(result);
  };

  // Verify Customer
  const verifyCustomer = (id) => {
    fetch(`http://localhost:8080/api/admin/customers/verify/${id}`, {
      method: "PUT"
    });

    alert("Customer Verified");
    window.location.reload();
  };

  // Unverify Customer
  const unverifyCustomer = (id) => {
    fetch(`http://localhost:8080/api/admin/customers/unverify/${id}`, {
      method: "PUT"
    });

    alert("Customer Unverified");
    window.location.reload();
  };

  return (
    <div className="admin-customers-container">
      <h1>Customers Management</h1>

      {/* Search Box */}
      <div className="customer-search-box">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search customers..." 
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>City</th>
            <th>Pincode</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Customers Found
              </td>
            </tr>
          ) : (
            filtered.map((c, index) => (
              <tr key={index}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.mobile}</td>
                <td>{c.city}</td>
                <td>{c.pincode}</td>

                <td>
                  {c.verified ? (
                    <span className="verified"><FaCheckCircle /> Verified</span>
                  ) : (
                    <span className="unverified"><FaTimesCircle /> Unverified</span>
                  )}
                </td>

                <td>
                  {c.verified ? (
                    <button className="unverify-btn" onClick={() => unverifyCustomer(c.id)}>
                      Unverify
                    </button>
                  ) : (
                    <button className="verify-btn" onClick={() => verifyCustomer(c.id)}>
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
