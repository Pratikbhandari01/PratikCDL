import React, { useState } from 'react';
import rooms from '../data/rooms';
import RoomCard from '../components/RoomCard';
import './RoomsPage.css';

function RoomsPage({ navigate }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState(700);

  const filters = [
    { id: 'all', label: 'All Rooms' },
    { id: 'budget', label: 'Budget (< $150)' },
    { id: 'mid', label: 'Mid-Range ($150–$300)' },
    { id: 'luxury', label: 'Luxury (> $300)' },
  ];

  const getFilteredRooms = () => {
    let filtered = rooms.filter(room => room.price <= priceRange);

    if (filter === 'budget') filtered = filtered.filter(r => r.price < 150);
    else if (filter === 'mid') filtered = filtered.filter(r => r.price >= 150 && r.price <= 300);
    else if (filter === 'luxury') filtered = filtered.filter(r => r.price > 300);

    if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

    return filtered;
  };

  const filteredRooms = getFilteredRooms();

  return (
    <div className="rooms-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="page-header">
        <div className="page-header-overlay"></div>
        <div className="page-header-content">
          <p className="breadcrumb">
            <button onClick={() => navigate('home')}>Home</button>
            <span> / </span>
            <span>Rooms</span>
          </p>
          <h1>Our Rooms & Suites</h1>
          <p>Choose from our carefully curated selection of luxury accommodations</p>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-tabs">
            {filters.map(f => (
              <button
                key={f.id}
                className={`filter-tab ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="filter-controls">
            <div className="price-filter">
              <label>Max Price: <strong>${priceRange}/night</strong></label>
              <input
                type="range"
                min="89"
                max="700"
                step="10"
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="price-slider"
              />
            </div>

            <div className="sort-control">
              <label>Sort by:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ROOMS GRID ===== */}
      <div className="rooms-section">
        <div className="rooms-container">
          <div className="results-info">
            <p>Showing <strong>{filteredRooms.length}</strong> room{filteredRooms.length !== 1 ? 's' : ''}</p>
          </div>

          {filteredRooms.length > 0 ? (
            <div className="rooms-grid-full">
              {filteredRooms.map(room => (
                <RoomCard key={room.id} room={room} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span>🔍</span>
              <h3>No rooms found</h3>
              <p>Try adjusting your filters to see more options.</p>
              <button className="btn-primary" onClick={() => { setFilter('all'); setPriceRange(700); }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;
