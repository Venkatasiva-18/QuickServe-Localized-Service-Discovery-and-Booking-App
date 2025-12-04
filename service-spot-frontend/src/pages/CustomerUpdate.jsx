import React, { useEffect, useState } from "react";
import "./CustomerUpdate.css";
import { FaUserEdit, FaMapMarkerAlt } from "react-icons/fa";

export default function CustomerUpdate() {

  const customerId = localStorage.getItem("customerId") || 1;

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    doorNo: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: ""
  });

  // Fetch existing details
  useEffect(() => {
    fetch(`http://localhost:8080/api/customer/${customerId}`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(err => console.log("Error fetching profile:", err));
  }, []);

  // Update form values
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  // Get current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      });
    } else {
      alert("Geolocation not supported!");
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/api/customer/update/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    .then(() => alert("Profile Updated Successfully!"))
    .catch(() => alert("Update Failed!"));
  };

  return (
    <div className="update-container">

      <div className="update-icon">
        <FaUserEdit size={120} color="#0A4D68" />
      </div>

      <h1>Update Customer Details</h1>

      <form className="update-form" onSubmit={handleSubmit}>

        {/* PERSONAL DETAILS */}
        <fieldset className="fieldset-box">
          <legend>Personal Details</legend>

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="e.g., John Doe" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="e.g., john@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Mobile</label>
            <input type="text" name="mobile" placeholder="e.g., 9876543210" value={form.mobile} onChange={handleChange} required />
          </div>
        </fieldset>

        {/* ADDRESS DETAILS */}
        <fieldset className="fieldset-box">
          <legend>Address</legend>

          <div className="form-group">
            <label>Door No</label>
            <input type="text" name="doorNo" placeholder="e.g., 42" value={form.doorNo} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address Line</label>
            <input type="text" name="addressLine" placeholder="e.g., Main Street, Sector 5" value={form.addressLine} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" placeholder="e.g., Mumbai" value={form.city} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" placeholder="e.g., Maharashtra" value={form.state} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" placeholder="e.g., India" value={form.country} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input type="text" name="pincode" placeholder="e.g., 400001" value={form.pincode} onChange={handleChange} />
          </div>
        </fieldset>

        {/* LOCATION */}
        <fieldset className="fieldset-box">
          <legend>Location</legend>

          <div className="form-group">
            <label>Latitude</label>
            <input type="text" name="latitude" placeholder="Detected automatically" value={form.latitude} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Longitude</label>
            <input type="text" name="longitude" placeholder="Detected automatically" value={form.longitude} onChange={handleChange} />
          </div>

          <button type="button" className="location-btn" onClick={getLocation}>
            <FaMapMarkerAlt /> Get Current Location
          </button>
        </fieldset>

        <button type="submit" className="update-btn">Update Profile</button>

      </form>
    </div>
  );
}
