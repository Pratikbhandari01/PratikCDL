import React from 'react';
import hotels from '../data/hotels';
import './RoomCard.css';

function RoomCard({ room, navigate }) {
  const hotel = hotels.find(h => h.id === room.hotelId);
  return (
    <div className="room-card">
      <div className="room-image">
        <div
          className="room-img-bg"
          style={{ background: room.gradient }}
        >
          <span className="room-emoji">{room.emoji}</span>
        </div>
        <div className="room-badge">{room.badge}</div>
      </div>
      <div className="room-info">
        {hotel && <p className="room-hotel">🏨 {hotel.name}</p>}
        <div className="room-header">
          <h3>{room.name}</h3>
          <div className="room-price">
            <span className="price">${room.price}</span>
            <span className="per-night">/night</span>
          </div>
        </div>
        <p className="room-description">{room.description}</p>
        <div className="room-amenities">
          {room.amenities.map((amenity, i) => (
            <span key={i} className="amenity-tag">{amenity}</span>
          ))}
        </div>
        <div className="room-details">
          <span>👥 {room.guests} Guests</span>
          <span>🛏️ {room.beds}</span>
          <span>📐 {room.size}</span>
        </div>
        <div className="room-rating">
          <span className="stars">{'⭐'.repeat(room.stars)}</span>
          <span className="reviews">({room.reviews} reviews)</span>
        </div>
        <button
          className="btn-book-room"
          onClick={() => navigate('booking', room)}
        >
          Book This Room
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
