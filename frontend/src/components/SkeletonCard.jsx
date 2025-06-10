import React from 'react';

const SkeletonCard = () => {
  return (
    // Gunakan struktur dan class yang sama dengan EventCard asli
    <div className="event-card">
      <div className="skeleton skeleton-image"></div>
      <div className="event-card-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;