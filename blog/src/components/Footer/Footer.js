import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribe } from '../../api/api';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const res = await subscribe(email);
      setMsg(res.data.message);
      setEmail('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error subscribing');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h3>✍️ BlogSite</h3>
          <p>A place for stories, ideas, and knowledge. Read, write, and connect.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦 Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">📷 Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">💼 LinkedIn</a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/create">Write a Post</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Get the latest posts delivered to your inbox.</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email address" required
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
          {msg && <p className="newsletter-msg">{msg}</p>}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BlogSite. All rights reserved. Built with ❤️ using MERN Stack.</p>
      </div>
    </footer>
  );
}
