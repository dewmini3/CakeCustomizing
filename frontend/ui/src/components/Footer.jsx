import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <div className="company-info">
            <img src="/images/logo.png" alt="Chara Cakes Logo" className="footer-logo" />
            <div className="company-details">
              <p>Chara Cakes (Pvt) Ltd,</p>
              <p>24/A, Vajira Road,</p>
              <p>Pandura,</p>
              <p>Sri Lanka.</p>
            </div>
            <div className="contact-buttons">
              <a href="tel:+94123456789" className="contact-link">
                <i className="fas fa-phone"></i> Call us
              </a>
              <a href="mailto:info@characakes.com" className="contact-link">
                <i className="fas fa-envelope"></i> E-mail
              </a>
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul className="footer-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/outlets">Outlets</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* My Account Links */}
        <div className="footer-section">
          <h3>My account</h3>
          <ul className="footer-links">
            <li><Link to="/my-information">My information</Link></li>
            <li><Link to="/my-orders">My orders</Link></li>
            <li><Link to="/my-addresses">My Addresses</Link></li>
            <li><Link to="/lost-password">Lost Password</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-content">
          <p>Copyright © 2025 Chara Cakes All Rights Reserved</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 