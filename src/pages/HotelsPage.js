import React from 'react';
import hotels from '../data/hotels';
import rooms from '../data/rooms';
import './HotelsPage.css';

function HotelsPage({ navigate }) {
  const handleSelectHotel = (hotelId) => {
    navigate('rooms', { hotelId });
  };

  return (
    <div className="hotels-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="page-header">
        <div className="page-header-overlay"></div>
        <div className="page-header-content">
          <p className="breadcrumb">
            <button onClick={() => navigate('home')}>Home</button>
            <span> / </span>
            <span>Hotels</span>
          </p>
          <h1>Our Hotels</h1>
          <p>Discover our collection of luxury hotels in prime destinations</p>
        </div>
      </div>

      {/* ===== HOTELS GRID ===== */}
      <div className="hotels-container">
        <div className="hotels-grid">
          {hotels.map(hotel => {
            const hotelRooms = rooms.filter(room => room.hotelId === hotel.id);
            return (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image" style={{ background: hotel.image_url }}>
                  <span className="hotel-emoji">{hotel.image}</span>
                  <div className="hotel-rating">
                    <span className="stars">{'⭐'.repeat(hotel.rating)}</span>
                    <span className="reviews">({hotel.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-location">📍 {hotel.location}</p>
                  <p className="hotel-description">{hotel.description}</p>
                  
                  <div className="hotel-amenities">
                    <h4>Amenities:</h4>
                    <div className="amenities-list">
                      {hotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="amenity">{amenity}</span>
                      ))}
                    </div>
                  </div>

                  <div className="hotel-footer">
                    <span className="room-count">🛏️ {hotelRooms.length} room type{hotelRooms.length !== 1 ? 's' : ''}</span>
                    <button 
                      className="btn-view-rooms"
                      onClick={() => handleSelectHotel(hotel.id)}
                    >
                      View Rooms
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HotelsPage;
