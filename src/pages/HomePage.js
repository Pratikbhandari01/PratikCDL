import React, { useState } from 'react';
import rooms from '../data/rooms';
import RoomCard from '../components/RoomCard';
import './HomePage.css';

function HomePage({ navigate }) {
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomType: 'any',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('rooms');
  };

  const featuredRooms = rooms.slice(0, 3);

  const amenities = [
    { icon: 'POOL', title: 'Infinity Pool', desc: 'Rooftop pool with panoramic city views' },
    { icon: 'SPA', title: 'Luxury Spa', desc: 'Full-service spa and wellness center' },
    { icon: 'DINE', title: 'Fine Dining', desc: 'Three world-class restaurants on-site' },
    { icon: 'GYM', title: 'Fitness Center', desc: '24/7 state-of-the-art gym' },
    { icon: 'VALET', title: 'Valet Parking', desc: 'Complimentary valet service' },
    { icon: 'AIR', title: 'Airport Transfer', desc: 'Private airport shuttle service' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      text: 'Absolutely stunning hotel. The Presidential Suite exceeded all my expectations, and the staff made every detail feel effortless.',
      rating: 5,
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Honeymoon Guest',
      text: 'We spent our honeymoon here and it was magical. The Junior Suite balcony was perfect for a romantic getaway.',
      rating: 5,
      avatar: 'MC',
    },
    {
      name: 'The Williams Family',
      role: 'Family Vacation',
      text: 'The Family Suite was perfect for our kids. There was plenty of space, and we will definitely be coming back.',
      rating: 5,
      avatar: 'WF',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-subtitle">Welcome to LuxeStay Hotel</p>
            <h1 className="hero-title">
              Stay where <span className="gold-text">comfort</span> feels cinematic
            </h1>
            <p className="hero-description">
              Book refined rooms, generous suites, and polished hotel service in one
              calm place designed for memorable city escapes.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('rooms')}>
                Explore Rooms
              </button>
              <button className="btn-white" onClick={() => navigate('contact')}>
                Contact Us
              </button>
            </div>
            <div className="hero-trust-strip" aria-label="Booking highlights">
              <span>Best rate guaranteed</span>
              <span>Free cancellation</span>
              <span>Breakfast included</span>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Luxury Rooms</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Guests</span>
              </div>
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="search-container">
          <h2>Find Your Perfect Room</h2>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-field">
              <label>Check-In</label>
              <input
                type="date"
                value={searchData.checkIn}
                onChange={e => setSearchData({ ...searchData, checkIn: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="search-field">
              <label>Check-Out</label>
              <input
                type="date"
                value={searchData.checkOut}
                onChange={e => setSearchData({ ...searchData, checkOut: e.target.value })}
                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="search-field">
              <label>Guests</label>
              <select
                value={searchData.guests}
                onChange={e => setSearchData({ ...searchData, guests: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="search-field">
              <label>Room Type</label>
              <select
                value={searchData.roomType}
                onChange={e => setSearchData({ ...searchData, roomType: e.target.value })}
              >
                <option value="any">Any Type</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <button type="submit" className="btn-search">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="featured-rooms">
        <div className="container">
          <div className="section-title">
            <h2>Featured Rooms</h2>
            <div className="divider"></div>
            <p>Handpicked selections for an unforgettable stay</p>
          </div>
          <div className="rooms-grid">
            {featuredRooms.map(room => (
              <RoomCard key={room.id} room={room} navigate={navigate} />
            ))}
          </div>
          <div className="view-all-btn">
            <button className="btn-primary" onClick={() => navigate('rooms')}>
              View All Rooms
            </button>
          </div>
        </div>
      </section>

      <section className="amenities-section">
        <div className="container">
          <div className="section-title">
            <h2>World-Class Amenities</h2>
            <div className="divider"></div>
            <p>Everything you need for the perfect stay</p>
          </div>
          <div className="amenities-grid">
            {amenities.map((item, i) => (
              <div key={i} className="amenity-card">
                <div className="amenity-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-title">
            <h2>What Our Guests Say</h2>
            <div className="divider"></div>
            <p>Real experiences from real guests</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div>
                  <div className="testimonial-stars">
                    {'*****'.slice(0, t.rating)}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                </div>
                <div className="testimonial-author">
                  <span className="author-avatar">{t.avatar}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready for an Unforgettable Stay?</h2>
          <p>Book now and get up to 20% off on selected rooms</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('rooms')}>
              Book Now
            </button>
            <button className="btn-secondary" onClick={() => navigate('contact')}>
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
