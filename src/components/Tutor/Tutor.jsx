import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaRegStar, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

import './Tutor.css';
import StarRating from '../StarRating/StarRating';
import { useNavigate } from 'react-router-dom';

const Tutor = ({ tutor }) => {
  const {profilePic,rating,chargePerHour,firstName,lastName,categories,educationalQualification,_id}=tutor||{}
  const navigate=useNavigate()
  const handleNavigate=()=>{
    navigate(`/booking-form/${_id}`)
  }
  return (
    <Card className="tutor-card">
      <div className="profile-image-container">
        <Card.Img 
          variant="top" 
          src={profilePic} 
          alt={`${firstName} ${lastName}`}
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
            <FaMoneyBillWave /> ৳ {chargePerHour || 'N/A'}/hr
          </div>
        </div>



        <div className="tutor-skills">
          {categories?.map((category, index) => (
            <Badge key={index} bg="primary" className="me-1 mb-1">
              {category}
            </Badge>
          ))}
        </div>

        <Card.Text className="tutor-bio">
          {educationalQualification}
        </Card.Text>

        <div className="tutor-footer">
          <Button variant="primary" className="view-profile-btn" onClick={handleNavigate}>
            Book Now
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