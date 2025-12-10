import React from "react";
import "./Home.css";
import Search from "../components/Search";

export default function Home() {
  return (
    <div className="home-container">
      
      {/* HERO SECTION */}
      <section className="home-hero section-shell">
        
        <div className="hero-copy">
          <span className="hero-pill">✨ Book trusted experts instantly</span>

          <h1>Your One-Stop Platform to Find Skilled & Verified Professionals</h1>

          <p>
            Compare top-rated service providers, view transparent prices,
            and hire with confidence. ServiceSpot makes every booking simple,
            fast, and trustworthy.
          </p>

          {/* BUTTONS */}
          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => (window.location.href = "/register")}
            >
              🚀 Get Started
            </button>

            <button
              className="ghost-btn"
              onClick={() => (window.location.href = "/login")}
            >
              🔍 Explore Providers
            </button>
          </div>

          {/* METRICS */}
          <div className="hero-metrics">
            <div>
              <strong>6k+</strong>
              <span>Tasks Completed</span>
            </div>

            <div>
              <strong>1.2k</strong>
              <span>Verified Professionals</span>
            </div>

            <div>
              <strong>4.9/5</strong>
              <span>Customer Satisfaction</span>
            </div>
          </div>
        </div>

        {/* WHY SERVICESPOT CARD */}
        <div className="hero-card">
          <h3>Why Choose ServiceSpot? ⭐</h3>

          <ul>
            <li>✔️ Background-verified professionals</li>
            <li>✔️ Instant booking slots matching your schedule</li>
            <li>✔️ Transparent pricing — no hidden charges</li>
            <li>✔️ 24/7 customer support anytime you need</li>
          </ul>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className="home-search section-shell">
        <Search />
      </div>

      {/* HIGHLIGHTS */}
      <section className="home-highlights section-shell">

        <article className="highlight-card">
          <h4>🔎 Search • Compare • Book</h4>
          <p>
            Discover nearby experts with detailed profiles, real reviews,
            and live availability—all in one place.
          </p>
        </article>

        <article className="highlight-card">
          <h4>📡 Live Status Tracking</h4>
          <p>
            Stay informed from booking to completion with real-time updates,
            notifications, and instant chat.
          </p>
        </article>

        <article className="highlight-card">
          <h4>💳 Secure & Protected Payments</h4>
          <p>
            Pay safely and release payments only when you're 100% satisfied
            with the service delivered.
          </p>
        </article>
      </section>
    </div>
  );
}
