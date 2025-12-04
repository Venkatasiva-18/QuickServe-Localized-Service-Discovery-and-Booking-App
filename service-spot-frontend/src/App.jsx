import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";   // ✅ Added Footer

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterProvider from "./pages/RegisterProvider";

import Login from "./pages/Login";
import LoginProvider from "./pages/LoginProvider";
import LoginCustomer from "./pages/LoginCustomer";
import LoginAdmin from "./pages/LoginAdmin";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminProviders from "./pages/AdminProviders";

import CustomerProfile from "./pages/CustomerProfile";
import CustomerUpdate from "./pages/CustomerUpdate";

import ProviderProfile from "./pages/ProviderProfile";
import ProviderUpdate from "./pages/ProviderUpdate";



import SearchResults from "./pages/SearchResults";
import Contact from "./pages/Contact";   // ✅ Added Contact Page

// Optional future pages (if you decide to add)
// import MapView from "./pages/MapView";

export default function App() {
  return (
    <BrowserRouter>
      
      {/* Navbar is always visible */}
      <Navbar />

      {/* All routing pages */}
      <Routes>
        
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/register-provider" element={<RegisterProvider />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-provider" element={<LoginProvider />} />
        <Route path="/login-customer" element={<LoginCustomer />} />
        <Route path="/login-admin" element={<LoginAdmin />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-customers" element={<AdminCustomers />} />
        <Route path="/admin-providers" element={<AdminProviders />} />

        {/* Customer */}
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/customer-update" element={<CustomerUpdate />} />
        
        
        {/* Provider */}
        <Route path="/provider-profile" element={<ProviderProfile />} />
        <Route path="/provider-update" element={<ProviderUpdate />} />
       

        {/* Search */}
        <Route path="/search" element={<SearchResults />} />

        {/* Contact & Help */}
        <Route path="/contact" element={<Contact />} />

        {/* MapView (only if used later) */}
        {/* <Route path="/map" element={<MapView />} /> */}
        
      </Routes>

      {/* Footer always visible */}
      <Footer />

    </BrowserRouter>
  );
}
