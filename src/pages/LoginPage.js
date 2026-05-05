import React, { useState } from 'react';
import './AuthPage.css';

function LoginPage({ navigate, onLogin, pendingRoom, redirectAfterAuth }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onLogin(formData);
    if (!result.success) {
      setError(result.message || 'Unable to sign in.');
      return;
    }

    if (redirectAfterAuth === 'booking' && pendingRoom) {
      navigate('booking', pendingRoom);
      return;
    }

    if (redirectAfterAuth === 'profile') {
      navigate('profile');
      return;
    }

    navigate('home');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to unlock bookings, view your profile, and secure your stay.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary auth-submit">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <span>New here?</span>
          <button className="link-button" onClick={() => navigate('register')}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
