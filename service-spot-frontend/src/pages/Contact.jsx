import React, { useState } from "react";
import "./Contact.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted! We will contact you soon.");
  };

  return (
    <div className="contact-container">

      <h1>Contact & Help</h1>

      {/* Contact Details */}
      <div className="contact-info">
        <h2>Need Help? Reach Us</h2>

        <p><FaPhone /> +91 9876543210</p>
        <p><FaEnvelope /> support@servicespot.com</p>
        <p><FaMapMarkerAlt /> ServiceSpot Office, Guntur, Andhra Pradesh</p>
      </div>

      {/* Contact Form */}
      <form className="contact-form" onSubmit={handleSubmit}>

        <fieldset className="contact-fieldset">
          <legend>Contact Form</legend>

          <label>Your Name</label>
          <input 
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Your Email</label>
          <input 
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Your Message</label>
          <textarea 
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Send Message</button>

        </fieldset>

      </form>

      {/* Help / FAQ */}
      <div className="help-section">
        <h2>Help & FAQs</h2>

        <details>
          <summary>How do I register as a customer?</summary>
          <p>Go to the Register page and choose Customer registration.</p>
        </details>

        <details>
          <summary>How do I register as a service provider?</summary>
          <p>Choose Provider registration and enter service details.</p>
        </details>

        <details>
          <summary>How to search for providers?</summary>
          <p>Use the Search section and enter service, area, and city.</p>
        </details>

        <details>
          <summary>Can I update my profile?</summary>
          <p>Yes, customers and providers can update their details anytime.</p>
        </details>

      </div>

    </div>
  );
}
