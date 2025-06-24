import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import './PastClasses.css';

const PastClasses = ({ classes }) => {
  if (classes.length === 0) {
    return (
      <div className="no-classes">
        <h5>No past classes found</h5>
        <p>Your completed classes will appear here</p>
      </div>
    );
  }

  return (
    <Row className="classes-grid">
      {classes.map((classInfo) => (
        <Col key={classInfo._id} md={6} lg={4} className="mb-4">
          <Card className="class-card past">
            <Card.Body>
              <div className="class-header">
                <h5>{classInfo.subject || 'Tutoring Session'}</h5>
                <Badge bg="secondary">Completed</Badge>
              </div>
              
              <div className="class-details">
                <div className="detail-item">
                  <FaChalkboardTeacher className="detail-icon" />
                  <span>{classInfo.tutorName}</span>
                </div>
                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <span>{new Date(classInfo.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <span>{classInfo.startTime} - {classInfo.endTime}</span>
                </div>
                <div className="detail-item">
                  <FaMoneyBillWave className="detail-icon" />
                  <span>৳{classInfo.price || 'N/A'}</span>
                </div>
              </div>

              <div className="class-actions">
                {classInfo.isRated ? (
                  <div className="rating-display">
                    <span>Your rating: </span>
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        color={i < classInfo.rating ? '#ffc107' : '#e4e5e9'} 
                      />
                    ))}
                  </div>
                ) : (
                  <Button variant="outline-primary" size="sm">
                    Rate Tutor
                  </Button>
                )}
                <Button variant="outline-secondary" size="sm">
                  View Materials
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PastClasses;