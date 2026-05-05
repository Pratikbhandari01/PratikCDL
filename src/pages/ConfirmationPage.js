import React from 'react';
import './ConfirmationPage.css';

function ConfirmationPage({ booking, navigate }) {
  if (!booking) {
    return (
      <div className="no-booking">
        <h2>No booking found</h2>
        <button className="btn-primary" onClick={() => navigate('home')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      {/* ===== SUCCESS BANNER ===== */}
      <div className="success-banner">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h1>Booking Confirmed!</h1>
          <p>Thank you, <strong>{booking.firstName} {booking.lastName}</strong>! Your reservation has been successfully placed.</p>
          <div className="booking-id-badge">
            Booking ID: <strong>{booking.bookingId}</strong>
          </div>
        </div>
      </div>

      {/* ===== CONFIRMATION DETAILS ===== */}
      <div className="confirmation-container">
        <div className="confirmation-grid">

          {/* BOOKING DETAILS */}
          <div className="confirmation-card">
            <h2>🏨 Reservation Details</h2>

            <div className="room-summary">
              <div
                className="room-summary-img"
                style={{ background: booking.room.gradient }}
              >
                <span>{booking.room.emoji}</span>
              </div>
              <div className="room-summary-info">
                <h3>{booking.room.name}</h3>
                <p>{booking.room.beds} · {booking.room.size}</p>
                <div className="room-amenities-mini">
                  {booking.room.amenities.slice(0, 3).map((a, i) => (
                    <span key={i}>{a}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">📅 Check-In</span>
                <span className="detail-value">{booking.checkIn}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📅 Check-Out</span>
                <span className="detail-value">{booking.checkOut}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🌙 Duration</span>
                <span className="detail-value">{booking.nights} Night{booking.nights > 1 ? 's' : ''}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">👥 Guests</span>
                <span className="detail-value">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📆 Booked On</span>
                <span className="detail-value">{booking.bookingDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">💳 Payment</span>
                <span className="detail-value capitalize">
                  {booking.paymentMethod === 'card' ? 'Credit Card' :
                   booking.paymentMethod === 'paypal' ? 'PayPal' : 'Pay at Hotel'}
                </span>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="special-requests">
                <h4>📝 Special Requests</h4>
                <p>{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* GUEST & PAYMENT INFO */}
          <div className="side-cards">
            <div className="confirmation-card">
              <h2>👤 Guest Information</h2>
              <div className="info-list">
                <div className="info-item">
                  <span>Name</span>
                  <strong>{booking.firstName} {booking.lastName}</strong>
                </div>
                <div className="info-item">
                  <span>Email</span>
                  <strong>{booking.email}</strong>
                </div>
                <div className="info-item">
                  <span>Phone</span>
                  <strong>{booking.phone}</strong>
                </div>
              </div>
            </div>

            <div className="confirmation-card pricing-card">
              <h2>💰 Payment Summary</h2>
              <div className="pricing-breakdown">
                <div className="pricing-row">
                  <span>${booking.room.price} × {booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                  <span>${booking.subtotal.toLocaleString()}</span>
                </div>
                <div className="pricing-row">
                  <span>Taxes & Fees (12%)</span>
                  <span>${booking.taxes.toLocaleString()}</span>
                </div>
                <div className="pricing-row total-row">
                  <span>Total Paid</span>
                  <span>${booking.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-card info-card">
              <h2>ℹ️ What's Next?</h2>
              <ul className="next-steps">
                <li>
                  <span className="step-icon">📧</span>
                  <span>A confirmation email has been sent to <strong>{booking.email}</strong></span>
                </li>
                <li>
                  <span className="step-icon">🕐</span>
                  <span>Check-in time is <strong>3:00 PM</strong>. Early check-in available on request.</span>
                </li>
                <li>
                  <span className="step-icon">🆔</span>
                  <span>Please bring a valid ID and your booking ID: <strong>{booking.bookingId}</strong></span>
                </li>
                <li>
                  <span className="step-icon">📞</span>
                  <span>Need help? Call us at <strong>+1 (800) 555-LUXE</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="confirmation-actions">
          <button className="btn-print" onClick={() => window.print()}>
            🖨️ Print Confirmation
          </button>
          <button className="btn-primary" onClick={() => navigate('rooms')}>
            Book Another Room
          </button>
          <button className="btn-secondary" onClick={() => navigate('home')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
