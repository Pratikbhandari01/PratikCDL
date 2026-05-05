import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hotel_user');
    const storedToken = localStorage.getItem('hotel_token');
    if (storedUser && storedToken) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, []);

  const navigate = (page, data = null) => {
    if ((page === 'booking' || page === 'profile') && !authUser) {
      if (page === 'booking') {
        setSelectedRoom(data);
      }
      setRedirectAfterAuth(page);
      setCurrentPage('login');
      window.scrollTo(0, 0);
      return;
    }

    if (page !== 'booking' && page !== 'profile') {
      setRedirectAfterAuth(null);
    }

    setCurrentPage(page);
    if (data) {
      if (page === 'booking') setSelectedRoom(data);
      if (page === 'confirmation') setBookingData(data);
    }
    window.scrollTo(0, 0);
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Login failed.' };
      }

      setAuthUser(data.user);
      localStorage.setItem('hotel_user', JSON.stringify(data.user));
      localStorage.setItem('hotel_token', data.token);
      setRedirectAfterAuth(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Unable to connect to auth server.' };
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Registration failed.' };
      }

      setAuthUser(data.user);
      localStorage.setItem('hotel_user', JSON.stringify(data.user));
      localStorage.setItem('hotel_token', data.token);
      setRedirectAfterAuth(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Unable to connect to auth server.' };
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('hotel_user');
    localStorage.removeItem('hotel_token');
    setCurrentPage('home');
    setRedirectAfterAuth(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'rooms':
        return <RoomsPage navigate={navigate} />;
      case 'booking':
        return <BookingPage room={selectedRoom} navigate={navigate} authUser={authUser} />;
      case 'confirmation':
        return <ConfirmationPage booking={bookingData} navigate={navigate} />;
      case 'contact':
        return <ContactPage navigate={navigate} />;
      case 'profile':
        return <ProfilePage authUser={authUser} navigate={navigate} />;
      case 'login':
        return (
          <LoginPage
            navigate={navigate}
            onLogin={handleLogin}
            pendingRoom={selectedRoom}
            redirectAfterAuth={redirectAfterAuth}
          />
        );
      case 'register':
        return (
          <RegisterPage
            navigate={navigate}
            onRegister={handleRegister}
            pendingRoom={selectedRoom}
            redirectAfterAuth={redirectAfterAuth}
          />
        );
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      <Navbar
        currentPage={currentPage}
        navigate={navigate}
        authUser={authUser}
        onLogout={handleLogout}
      />
      <main>{renderPage()}</main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🏨 LuxeStay Hotel</h3>
            <p>Experience luxury and comfort like never before. Your perfect getaway awaits.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => navigate('home')}>Home</button></li>
              <li><button onClick={() => navigate('rooms')}>Rooms</button></li>
              <li><button onClick={() => navigate('contact')}>Contact</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📍 123 Luxury Avenue, Miami, FL</p>
            <p>📞 +1 (800) 555-LUXE</p>
            <p>✉️ info@luxestay.com</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <span>📘 Facebook</span>
              <span>📸 Instagram</span>
              <span>🐦 Twitter</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 LuxeStay Hotel. All rights reserved. | CDL Intern Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
