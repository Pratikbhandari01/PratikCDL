import React from 'react';
import './ProfilePage.css';

function ProfilePage({ authUser, navigate }) {
  if (!authUser) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Profile unavailable</h2>
          <p>Please sign in to view your profile.</p>
          <button className="btn-primary" onClick={() => navigate('login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{authUser.username.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{authUser.username}</h2>
            <p>Member since your first booking</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span>Email</span>
            <strong>{authUser.email}</strong>
          </div>
          <div className="detail-row">
            <span>Username</span>
            <strong>{authUser.username}</strong>
          </div>
          <div className="detail-row">
            <span>Account</span>
            <strong>Active</strong>
          </div>
        </div>

        <div className="profile-summary">
          <h3>Your stay summary</h3>
          <p>
            You can book rooms, manage your preferences, and check your upcoming trips from this page.
            This is a simple profile dashboard for the frontend booking experience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
