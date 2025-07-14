import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Uni Hub</h1>
            <p>A comprehensive campus social platform designed for university students</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Register Now</Link>
              <Link to="/communities" className="btn btn-secondary">Explore Communities</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Management</h3>
              <p>Create and manage your interest communities, and connect with like-minded students</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Event Organization</h3>
              <p>Host and join various campus events to enrich your university life</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Information Sharing</h3>
              <p>Share your thoughts and experiences, and interact with fellow students</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Real-time Notify</h3>
              <p>Get important updates in time and never miss any exciting content</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 