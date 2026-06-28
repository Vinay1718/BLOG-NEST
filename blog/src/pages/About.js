import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-page container">
      <div className="about-hero">
        <h1>About BlogSite</h1>
        <p>A community of writers sharing ideas, stories, and knowledge.</p>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>BlogSite was created with a simple mission: to give everyone a place to share their voice. Whether you're a seasoned writer, a passionate hobbyist, or someone with a story to tell — this platform is for you.</p>
          <p>We believe in the power of words to educate, inspire, and connect. Our platform makes it easy to publish your ideas and reach readers around the world.</p>
        </section>
        <div className="about-stats">
          <div className="stat-card"><span className="stat-number">500+</span><span className="stat-label">Published Posts</span></div>
          <div className="stat-card"><span className="stat-number">1,200+</span><span className="stat-label">Active Readers</span></div>
          <div className="stat-card"><span className="stat-number">50+</span><span className="stat-label">Writers</span></div>
          <div className="stat-card"><span className="stat-number">10+</span><span className="stat-label">Categories</span></div>
        </div>
        <section className="about-section">
          <h2>What We Cover</h2>
          <div className="topics-grid">
            {['Technology', 'Health & Wellness', 'Career & Finance', 'Travel', 'Lifestyle', 'Science', 'Education', 'Food'].map(t => (
              <div key={t} className="topic-chip">{t}</div>
            ))}
          </div>
        </section>
        <section className="about-section">
          <h2>Join the Community</h2>
          <p>Ready to start writing? Create a free account and publish your first post today. Our community welcomes writers of all backgrounds and experience levels.</p>
          <Link to="/register" className="btn btn-primary" style={{marginTop:'16px',display:'inline-flex'}}>Get Started — It's Free</Link>
        </section>
      </div>
    </div>
  );
}
