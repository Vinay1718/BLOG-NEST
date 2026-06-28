import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

export default function Terms() {
  return (
    <div className="legal-page container">
      <div className="legal-card">
        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p>Last updated: January 1, 2025</p>
        </div>
        <div className="legal-body">
          <section><h2>1. Acceptance of Terms</h2>
            <p>By using BlogSite, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p>
          </section>
          <section><h2>2. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account. You must provide accurate information when registering. You may not impersonate others or create accounts for malicious purposes.</p>
          </section>
          <section><h2>3. Content Policy</h2>
            <p>You retain ownership of the content you post. By publishing on BlogSite, you grant us a non-exclusive license to display your content on the platform. You must not post content that is illegal, harmful, defamatory, or infringes on others' intellectual property.</p>
          </section>
          <section><h2>4. Prohibited Conduct</h2>
            <p>You may not use BlogSite to spam, harass other users, post malware, scrape content without permission, or attempt to gain unauthorized access to our systems.</p>
          </section>
          <section><h2>5. Content Removal</h2>
            <p>We reserve the right to remove any content that violates these terms without prior notice. Repeat violations may result in account termination.</p>
          </section>
          <section><h2>6. Disclaimer</h2>
            <p>BlogSite is provided "as is" without warranties of any kind. We are not responsible for the accuracy of user-posted content or any damages resulting from use of the platform.</p>
          </section>
          <section><h2>7. Contact</h2>
            <p>For questions about these terms, use our <Link to="/contact">contact form</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
