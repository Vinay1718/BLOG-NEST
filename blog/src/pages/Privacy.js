import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

export default function Privacy() {
  return (
    <div className="legal-page container">
      <div className="legal-card">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: January 1, 2025</p>
        </div>
        <div className="legal-body">
          <section><h2>1. Information We Collect</h2>
            <p>When you create an account, we collect your name, email address, and password (stored as a secure hash). When you write posts or comments, that content is stored in our database associated with your account.</p>
          </section>
          <section><h2>2. How We Use Your Information</h2>
            <p>We use your information solely to provide the BlogSite service — to display your published content, allow you to log in, and show your name on posts and comments. We do not sell your data to third parties.</p>
          </section>
          <section><h2>3. Newsletter</h2>
            <p>If you subscribe to our newsletter, we store your email address and use it only to send blog updates. You can unsubscribe at any time by contacting us.</p>
          </section>
          <section><h2>4. Cookies</h2>
            <p>We use a JWT token stored in your browser's local storage to keep you logged in. We do not use tracking or advertising cookies.</p>
          </section>
          <section><h2>5. Data Security</h2>
            <p>Passwords are encrypted using bcrypt. We use HTTPS in production. However, no method of transmission over the internet is 100% secure.</p>
          </section>
          <section><h2>6. Your Rights</h2>
            <p>You may delete your account and all associated content at any time by contacting us. You may also request an export of your data.</p>
          </section>
          <section><h2>7. Contact</h2>
            <p>For privacy questions, email us at <a href="mailto:privacy@blogsite.com">privacy@blogsite.com</a> or use our <Link to="/contact">contact form</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
