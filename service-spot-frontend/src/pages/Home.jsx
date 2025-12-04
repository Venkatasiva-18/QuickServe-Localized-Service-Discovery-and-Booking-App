import React from "react";
import "./Home.css";
import Search from "../components/Search";   // <-- Import Search Component

export default function Home() {
  return (
    <div className="home-container">
      <section className="home-hero section-shell">
        <div className="hero-copy">
          <span className="hero-pill">Book trusted experts instantly</span>
          <h1>ServiceSpot finds the right professional for every task</h1>
          <p>
            Compare verified providers, check transparent pricing, and get work started
            faster with a platform built for comfort and trust.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => window.location.href = "/register"}>
              Get Started
            </button>
            <button className="ghost-btn" onClick={() => window.location.href = "/login"}>
              Explore Providers
            </button>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>6k+</strong>
              <span>Requests resolved</span>
            </div>
            <div>
              <strong>1.2k</strong>
              <span>Verified partners</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <h3>Why ServiceSpot?</h3>
          <ul>
            <li>Curated professionals with background verification</li>
            <li>Instant booking slots that fit your schedule</li>
            <li>Transparent pricing with no surprise fees</li>
            <li>24/7 customer care to keep you supported</li>
          </ul>
        </div>
      </section>

      <div className="home-search section-shell">
        <Search />
      </div>

      <section className="home-highlights section-shell">
        <article className="highlight-card">
          <h4>Search, compare, confirm</h4>
          <p>Discover nearby experts with robust profiles, reviews, and availability in one place.</p>
        </article>

        <article className="highlight-card">
          <h4>Live status tracking</h4>
          <p>Stay updated from quote to completion with notifications and instant chat.</p>
        </article>

        <article className="highlight-card">
          <h4>Secure payments</h4>
          <p>Release payouts only when you are satisfied and build trust with every booking.</p>
        </article>
      </section>
    </div>
  );
}
