import React from 'react';
import './HomeBanner.css'; // Import the CSS file
import bannerImage from '../../assets/home-banner-image.avif'; // Adjust the path to your image

const HomeBanner = () => {
  return (
    <div className="home-banner-container container py-5">
      <div className="row align-items-center">
        {/* Left Side - Image */}
        <div className="col-md-6 mb-4 mb-md-0">
          <div className="banner-image-wrapper">
            <img 
              src={bannerImage} 
              alt="Banner" 
              className="img-fluid rounded shadow"
            />
          </div>
        </div>

        {/* Right Side - About Us */}
        <div className="col-md-6">
          <div className="banner-content">
            <h2 className="banner-title mb-4">About Us</h2>
            <p className="banner-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
              Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
              rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna 
              non est bibendum non venenatis nisl tempor.
            </p>
            <p className="banner-text">
              Suspendisse potenti. Sed egestas, ante et vulputate volutpat, eros pede semper 
              est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing.
            </p>
            <button className="btn btn-primary mt-3">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;