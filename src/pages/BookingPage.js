import React, { useState } from 'react';
import './BookingPage.css';

function BookingPage({ room, navigate }) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: today,
    checkOut: tomorrow,
    guests: '1',
    specialRequests: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  if (!room) {
    return (
      <div className="no-room">
        <h2>No room selected</h2>
        <button className="btn-primary" onClick={() => navigate('rooms')}>Browse Rooms</button>
      </div>
    );
  }

  const getNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const diff = new Date(formData.checkOut) - new Date(formData.checkIn);
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = getNights();
  const subtotal = room.price * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    if (formData.checkOut <= formData.checkIn) newErrors.checkOut = 'Check-out must be after check-in';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (formData.paymentMethod !== 'card') return true;
    const newErrors = {};
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number';
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
    if (!formData.cardCVV.trim()) newErrors.cardCVV = 'CVV is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const bookingConfirmation = {
      ...formData,
      room,
      nights,
      subtotal,
      taxes,
      total,
      bookingId: 'LX' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      bookingDate: new Date().toLocaleDateString(),
    };

    navigate('confirmation', bookingConfirmation);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  return (
    <div className="booking-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="booking-header">
        <div className="booking-header-content">
          <p className="breadcrumb">
            <button onClick={() => navigate('home')}>Home</button>
            <span> / </span>
            <button onClick={() => navigate('rooms')}>Rooms</button>
            <span> / </span>
            <span>Booking</span>
          </p>
          <h1>Complete Your Booking</h1>
          <p>You're just a few steps away from your perfect stay</p>
        </div>
      </div>

      {/* ===== PROGRESS STEPS ===== */}
      <div className="progress-bar-container">
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
            <span>Guest Details</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* ===== BOOKING CONTENT ===== */}
      <div className="booking-content">
        <div className="booking-form-section">
          <form onSubmit={handleSubmit}>

            {/* STEP 1: GUEST DETAILS */}
            {step === 1 && (
              <div className="form-section fade-in">
                <h2>👤 Guest Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                </div>

                <h2>📅 Stay Details</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Check-In Date *</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={today}
                      className={errors.checkIn ? 'error' : ''}
                    />
                    {errors.checkIn && <span className="error-msg">{errors.checkIn}</span>}
                  </div>
                  <div className="form-group">
                    <label>Check-Out Date *</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={formData.checkIn || today}
                      className={errors.checkOut ? 'error' : ''}
                    />
                    {errors.checkOut && <span className="error-msg">{errors.checkOut}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Number of Guests</label>
                    <select name="guests" value={formData.guests} onChange={handleChange}>
                      {Array.from({ length: room.guests }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requests or preferences? (e.g., high floor, extra pillows, early check-in)"
                    rows="4"
                  />
                </div>

                <button type="button" className="btn-next" onClick={handleNext}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="form-section fade-in">
                <h2>💳 Payment Method</h2>

                <div className="payment-methods">
                  {[
                    { id: 'card', label: '💳 Credit / Debit Card' },
                    { id: 'paypal', label: '🅿️ PayPal' },
                    { id: 'cash', label: '💵 Pay at Hotel' },
                  ].map(method => (
                    <label key={method.id} className={`payment-option ${formData.paymentMethod === method.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                      />
                      {method.label}
                    </label>
                  ))}
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="card-form fade-in">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={e => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={errors.cardNumber ? 'error' : ''}
                      />
                      {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                    </div>

                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={errors.cardName ? 'error' : ''}
                      />
                      {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className={errors.cardExpiry ? 'error' : ''}
                        />
                        {errors.cardExpiry && <span className="error-msg">{errors.cardExpiry}</span>}
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          placeholder="123"
                          maxLength="4"
                          className={errors.cardCVV ? 'error' : ''}
                        />
                        {errors.cardCVV && <span className="error-msg">{errors.cardCVV}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'paypal' && (
                  <div className="paypal-info fade-in">
                    <p>🅿️ You will be redirected to PayPal to complete your payment securely.</p>
                  </div>
                )}

                {formData.paymentMethod === 'cash' && (
                  <div className="cash-info fade-in">
                    <p>💵 Your reservation will be held. Please pay at the front desk upon arrival.</p>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn-confirm">
                    ✅ Confirm Booking — ${total.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ===== BOOKING SUMMARY ===== */}
        <div className="booking-summary">
          <div className="summary-card">
            <h3>📋 Booking Summary</h3>

            <div className="summary-room">
              <div
                className="summary-room-img"
                style={{ background: room.gradient }}
              >
                <span>{room.emoji}</span>
              </div>
              <div>
                <h4>{room.name}</h4>
                <p>{room.beds} · {room.size}</p>
              </div>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>📅 Check-In</span>
                <strong>{formData.checkIn || '—'}</strong>
              </div>
              <div className="summary-row">
                <span>📅 Check-Out</span>
                <strong>{formData.checkOut || '—'}</strong>
              </div>
              <div className="summary-row">
                <span>🌙 Nights</span>
                <strong>{nights}</strong>
              </div>
              <div className="summary-row">
                <span>👥 Guests</span>
                <strong>{formData.guests}</strong>
              </div>
            </div>

            <div className="summary-pricing">
              <div className="price-row">
                <span>${room.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Taxes & Fees (12%)</span>
                <span>${taxes.toLocaleString()}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="summary-badges">
              <span>🔒 Secure Booking</span>
              <span>✅ Free Cancellation</span>
              <span>🏆 Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
