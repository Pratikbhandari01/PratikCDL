import React, { useState } from 'react';
import './AuthPage.css';

function RegisterPage({ navigate, onRegister, pendingRoom, redirectAfterAuth }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await onRegister({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setError(result.message || 'Registration failed.');
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
          <h2>Create your account</h2>
          <p>Register now to save bookings and manage your stay easily.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Full name</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary auth-submit">
            Register
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button className="link-button" onClick={() => navigate('login')}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
