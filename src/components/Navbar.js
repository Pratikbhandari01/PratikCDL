import React, { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar({ currentPage, navigate, authUser, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('home')}>
          <span className="brand-icon">🏨</span>
          <span className="brand-name">LuxeStay</span>
        </div>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.id}>
              <button
                className={currentPage === link.id ? 'active' : ''}
                onClick={() => { navigate(link.id); setMenuOpen(false); }}
              >
                {link.label}
              </button>
            </li>
          ))}
          {authUser ? (
            <> 
              <li>
                <button className={currentPage === 'profile' ? 'active' : ''} onClick={() => { navigate('profile'); setMenuOpen(false); }}>
                  Hi, {authUser.username}
                </button>
              </li>
              <li>
                <button className="btn-book-now" onClick={() => { onLogout(); setMenuOpen(false); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <> 
              <li>
                <button
                  className={currentPage === 'login' ? 'active' : ''}
                  onClick={() => { navigate('login'); setMenuOpen(false); }}
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  className="btn-book-now"
                  onClick={() => { navigate('register'); setMenuOpen(false); }}
                >
                  Register
                </button>
              </li>
            </>
          )}
        </ul>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
