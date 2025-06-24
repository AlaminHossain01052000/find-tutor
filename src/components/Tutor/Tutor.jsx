import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaRegStar, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

import './Tutor.css';
import StarRating from '../StarRating/StarRating';

const Tutor = ({ tutor }) => {
  const calculateRating = () => {
    if (!tutor.ratings || tutor.ratings === 0) return 0;
    return tutor.ratings / (tutor.isRatedYet ? 1 : 5); // Simple rating calculation
  };

  const rating = calculateRating();

  return (
    <Card className="tutor-card">
      <div className="profile-image-container">
        <Card.Img 
          variant="top" 
          src={tutor.profilePic ? `/uploads/${tutor.profilePic.replace(/\\/g, '/')}` : '/default-profile.jpg'} 
          alt={`${tutor.firstName} ${tutor.lastName}`}
        />
        <div className="rating-badge">
          <StarRating rating={rating} />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <Card.Body>
        <div className="tutor-header">
          <Card.Title>{tutor.firstName} {tutor.lastName}</Card.Title>
          <div className="hourly-rate">
            <FaMoneyBillWave /> ৳{tutor.hourlyRate || 'N/A'}/hr
          </div>
        </div>

        <Card.Subtitle className="mb-2 text-muted">
          <FaMapMarkerAlt /> {tutor.location || 'Remote'}
        </Card.Subtitle>

        <div className="tutor-skills">
          {tutor.categories?.map((category, index) => (
            <Badge key={index} bg="primary" className="me-1 mb-1">
              {category}
            </Badge>
          ))}
        </div>

        <Card.Text className="tutor-bio">
          {tutor.bio || `${tutor.qualification} with teaching experience`}
        </Card.Text>

        <div className="tutor-footer">
          <Button variant="primary" className="view-profile-btn">
            View Profile
          </Button>
          <Button variant="outline-primary">
            Message
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Tutor;