import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";

// Register
import Register from "./pages/Register";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterProvider from "./pages/RegisterProvider";

// Login
import Login from "./pages/Login";
import LoginCustomer from "./pages/LoginCustomer";
import LoginProvider from "./pages/LoginProvider";
import LoginAdmin from "./pages/LoginAdmin";

// Customer
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerUpdate from "./pages/CustomerUpdate";
import CustomerBookings from "./pages/CustomerBookings";
import BookService from "./pages/BookService";

// Provider
import ProviderProfile from "./pages/ProviderProfile";
import ProviderUpdate from "./pages/ProviderUpdate";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminProviders from "./pages/AdminProviders";

// Other
import SearchResults from "./pages/SearchResults";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />   {/* ⭐ NAVBAR ALWAYS VISIBLE */}

      <Routes>

        <Route path="/" element={<Home />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/register-provider" element={<RegisterProvider />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-customer" element={<LoginCustomer />} />
        <Route path="/login-provider" element={<LoginProvider />} />
        <Route path="/login-admin" element={<LoginAdmin />} />

        {/* Customer */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/customer-update" element={<CustomerUpdate />} />
        <Route path="/customer-bookings" element={<CustomerBookings />} />
        <Route path="/book-service" element={<BookService />} />

        {/* Provider */}
        <Route path="/provider-profile" element={<ProviderProfile />} />
        <Route path="/provider-update" element={<ProviderUpdate />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-customers" element={<AdminCustomers />} />
        <Route path="/admin-providers" element={<AdminProviders />} />

        {/* Contact & Search */}
        <Route path="/search" element={<SearchResults />} />
        <Route path="/contact-help" element={<Contact />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
