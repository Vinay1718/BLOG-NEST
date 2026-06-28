import React, { useState } from 'react';
import { sendContact } from '../api/api';
import { toast } from 'react-toastify';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContact(form);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="contact-page container">
      <div className="contact-grid">
        <div className="contact-info">
          <h1>Get In Touch</h1>
          <p>Have a question, suggestion, or want to collaborate? We'd love to hear from you.</p>
          <div className="contact-items">
            <div className="contact-item"><span>📧</span><div><strong>Email</strong><p>hello@blogsite.com</p></div></div>
            <div className="contact-item"><span>🌍</span><div><strong>Location</strong><p>Available Worldwide</p></div></div>
            <div className="contact-item"><span>⏰</span><div><strong>Response Time</strong><p>Within 24 hours</p></div></div>
          </div>
        </div>
        <div className="contact-form-card">
          {sent ? (
            <div className="sent-message">
              <span>✅</span>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button className="btn btn-primary" onClick={() => { setSent(false); setForm({ name:'', email:'', message:'' }); }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>Send a Message</h2>
              <div className="form-group"><label>Your Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" required /></div>
              <div className="form-group"><label>Message</label><textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us what's on your mind..." rows={6} required /></div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%',justifyContent:'center'}}>{loading ? 'Sending...' : '📨 Send Message'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
