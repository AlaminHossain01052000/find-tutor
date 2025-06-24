import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} size={size} color="#ffc107" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} size={size} color="#ffc107" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color="#ffc107" />);
    }
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;