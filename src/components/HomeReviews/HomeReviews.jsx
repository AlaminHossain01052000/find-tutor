import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomeReviews.css';
import reviewImage from '../../assets/home-reviews-image.avif'; // Your right side image

const HomeReviews = () => {
  // Sample review data
  const reviews = [
    {
      id: 1,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Sarah Johnson',
      comment: 'Excellent service! The team was professional and delivered beyond my expectations.',
      rating: 5
    },
    {
      id: 2,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Michael Chen',
      comment: 'Good quality work but the project took a bit longer than estimated.',
      rating: 4
    },
    {
      id: 3,
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      name: 'Emily Wilson',
      comment: 'Absolutely loved the results! Will definitely work with them again.',
      rating: 5
    }
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false
  };

  // Render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));
  };

  return (
    <div className="home-reviews container py-2 my-5">
      <div className="row align-items-center">
        {/* Left Side - Reviews Slider */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h2 className="section-title mb-5">What Our Students Say</h2>
          <Slider {...settings} className="review-slider">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-content text-center">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="review-user-img rounded-circle mb-3"
                  />
                  <h4 className="review-user-name">{review.name}</h4>
                  <div className="review-stars mb-3">
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-text">"{review.comment}"</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Side - Image */}
        <div className="col-lg-6">
          <div className="review-side-image">
            <img 
              src={reviewImage} 
              alt="Happy clients" 
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeReviews;