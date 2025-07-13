import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Uni Hub</h3>
            <p>A comprehensive campus social platform designed for college students</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Community Management</li>
              <li>Event Organization</li>
              <li>Information Sharing</li>
              <li>Interactive communication</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: contact@unihub.com</p>
            <p>Phone: 400-123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Uni Hub. All rights reserved。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 