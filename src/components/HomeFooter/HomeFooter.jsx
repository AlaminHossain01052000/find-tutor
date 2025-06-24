import './HomeFooter.css';

const HomeFooter = () => {
  return (
    <footer className="footer-section bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* Left Side - Copyright and Address */}
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="footer-left">
              <p className="mb-2">All Rights Reserved © FindTutor 2025</p>
              <p className="footer-address mb-0">
                123 Education Street, Learning City, LC 12345
              </p>
            </div>
          </div>

          {/* Right Side - Contact and Social Icons */}
          <div className="col-md-6">
            {/* Upper Part - WhatsApp and Email */}
            <div className="footer-contact mb-3">
              <a href="https://wa.me/1234567890" className="text-white me-3">
                <i className="fab fa-whatsapp me-2"></i>
                +1 (234) 567-890
              </a>
              <a href="mailto:info@findtutor.com" className="text-white">
                <i className="fas fa-envelope me-2"></i>
                info@findtutor.com
              </a>
            </div>

            {/* Lower Part - Social Icons */}
            <div className="footer-social">
              <a href="#" className="text-white me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;