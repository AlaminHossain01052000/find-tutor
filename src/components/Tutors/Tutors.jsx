import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Tutor from '../Tutor/Tutor';
import './Tutors.css';

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        const teacherTutors = response.data.filter(t => t.userType === 'teacher');
        setTutors(teacherTutors);
      } catch (err) {
        setError('Failed to load tutors');
        console.error('Error fetching tutors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="tutors-container py-4">
      <h2 className="text-center mb-4">Available Tutors</h2>
      
      <Row className="g-4">
        {tutors.length > 0 ? (
          tutors.map(tutor => (
            <Col key={tutor._id} xs={12} sm={6} md={4} lg={3}>
              <Tutor tutor={tutor} />
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <h4>No tutors available at the moment</h4>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Tutors;