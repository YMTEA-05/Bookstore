import React from 'react';

interface StarRatingProps {
  rating: number;
  count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
      {halfStar === 1 && <span key="half">☆</span>} {/* Simple half-star */}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} style={{ color: '#d1d5db' }}>★</span>)}
      {count !== undefined && (
        <span style={{ marginLeft: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          ({count} reviews)
        </span>
      )}
    </div>
  );
};