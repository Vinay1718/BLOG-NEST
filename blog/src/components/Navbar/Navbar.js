import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">✍️</span> BlogSite
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          {user ? (
            <>
              <li><Link to="/create" onClick={() => setMenuOpen(false)} className="nav-create">✏️ Write</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              )}
              <li className="nav-dropdown">
                <span className="nav-avatar">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} />
                    : user.name.charAt(0).toUpperCase()
                  }
                </span>
                <ul className="dropdown-menu">
                  <li><Link to="/profile" onClick={() => setMenuOpen(false)}>👤 Profile</Link></li>
                  <li><button onClick={handleLogout}>🚪 Logout</button></li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline" style={{padding:'7px 16px'}}>Login</Link></li>
              <li><Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{padding:'7px 16px'}}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
