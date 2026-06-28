import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{textAlign:'center',padding:'100px 20px'}}>
      <div style={{fontSize:'5rem'}}>🔍</div>
      <h1 style={{fontSize:'3rem',fontWeight:800,margin:'20px 0 12px'}}>404</h1>
      <h2 style={{fontSize:'1.5rem',marginBottom:'12px',color:'var(--text)'}}>Page Not Found</h2>
      <p style={{color:'var(--text-muted)',marginBottom:'32px'}}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">← Back to Home</Link>
    </div>
  );
}
