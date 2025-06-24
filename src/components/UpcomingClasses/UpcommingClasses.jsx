import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaMoneyBillWave } from 'react-icons/fa';
import './UpcomingClasses.css';

const UpcomingClasses = ({ classes }) => {
  if (classes.length === 0) {
    return (
      <div className="no-classes">
        <h5>No upcoming classes scheduled</h5>
        <p>Book a class with your favorite tutor to get started!</p>
      </div>
    );
  }

  return (
    <Row className="classes-grid">
      {classes.map((classInfo) => (
        <Col key={classInfo._id} md={6} lg={4} className="mb-4">
          <Card className="class-card upcoming">
            <Card.Body>
              <div className="class-header">
                <h5>{classInfo.subject || 'Tutoring Session'}</h5>
                <Badge bg="success">Upcoming</Badge>
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
                <Button variant="primary" size="sm" className="me-2">
                  Join Class
                </Button>
                <Button variant="outline-danger" size="sm">
                  Cancel
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default UpcomingClasses;