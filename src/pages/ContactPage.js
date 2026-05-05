import React, { useState } from 'react';
import './ContactPage.css';

function ContactPage({ navigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const contactInfo = [
    { icon: '📍', title: 'Address', value: '123 Luxury Avenue, Miami Beach, FL 33139' },
    { icon: '📞', title: 'Phone', value: '+1 (800) 555-LUXE' },
    { icon: '✉️', title: 'Email', value: 'info@luxestay.com' },
    { icon: '🕐', title: 'Front Desk', value: '24 hours / 7 days a week' },
  ];

  const faqs = [
    {
      q: 'What time is check-in and check-out?',
      a: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out are available upon request.',
    },
    {
      q: 'Is parking available?',
      a: 'Yes, we offer complimentary valet parking for all guests. Self-parking is also available in our underground garage.',
    },
    {
      q: 'Do you allow pets?',
      a: 'We are a pet-friendly hotel. Pets up to 25 lbs are welcome with a small daily fee. Please inform us in advance.',
    },
    {
      q: 'What is your cancellation policy?',
      a: 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a one-night charge.',
    },
  ];

  return (
    <div className="contact-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="contact-header">
        <div className="contact-header-content">
          <p className="breadcrumb">
            <button onClick={() => navigate('home')}>Home</button>
            <span> / </span>
            <span>Contact</span>
          </p>
          <h1>Get In Touch</h1>
          <p>We're here to help make your stay perfect</p>
        </div>
      </div>

      {/* ===== CONTACT INFO CARDS ===== */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-info-grid">
            {contactInfo.map((item, i) => (
              <div key={i} className="contact-info-card">
                <div className="contact-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM + MAP ===== */}
      <section className="contact-main-section">
        <div className="contact-container">
          <div className="contact-grid">

            {/* FORM */}
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>

              {submitted ? (
                <div className="success-message">
                  <div className="success-icon-msg">✅</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out, <strong>{formData.name}</strong>! We'll respond to <strong>{formData.email}</strong> within 24 hours.</p>
                  <button
                    className="btn-primary"
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={errors.name ? 'error' : ''}
                      />
                      {errors.name && <span className="error-msg">{errors.name}</span>}
                    </div>
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
                  </div>

                  <div className="form-group">
                    <label>Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? 'error' : ''}
                    >
                      <option value="">Select a subject</option>
                      <option value="reservation">Reservation Inquiry</option>
                      <option value="cancellation">Cancellation Request</option>
                      <option value="amenities">Amenities & Services</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <span className="error-msg">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows="6"
                      className={errors.message ? 'error' : ''}
                    />
                    {errors.message && <span className="error-msg">{errors.message}</span>}
                  </div>

                  <button type="submit" className="btn-send">
                    📨 Send Message
                  </button>
                </form>
              )}
            </div>

            {/* MAP PLACEHOLDER */}
            <div className="map-section">
              <div className="map-placeholder">
                <div className="map-content">
                  <span className="map-pin">📍</span>
                  <h3>LuxeStay Hotel</h3>
                  <p>123 Luxury Avenue<br />Miami Beach, FL 33139</p>
                  <div className="map-grid">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="map-block"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hotel-hours">
                <h3>🕐 Hotel Hours</h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span>Front Desk</span>
                    <strong>24/7</strong>
                  </div>
                  <div className="hours-item">
                    <span>Restaurant</span>
                    <strong>6 AM – 11 PM</strong>
                  </div>
                  <div className="hours-item">
                    <span>Pool & Spa</span>
                    <strong>7 AM – 10 PM</strong>
                  </div>
                  <div className="hours-item">
                    <span>Fitness Center</span>
                    <strong>24/7</strong>
                  </div>
                  <div className="hours-item">
                    <span>Room Service</span>
                    <strong>24/7</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="faq-section">
        <div className="contact-container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <div className="divider"></div>
            <p>Quick answers to common questions</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-card">
                <h3>❓ {faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
