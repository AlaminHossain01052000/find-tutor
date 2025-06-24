import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

import './MyClasses.css';
import useAuth from '../../hooks/useAuth';
import UpcomingClasses from '../UpcomingClasses/UpcommingClasses';
import PastClasses from '../PastClasses/PastClasses';

const MyClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/classes');
        const studentClasses = response.data.filter(
          classInfo => classInfo.studentEmail === user.email
        );
        setClasses(studentClasses);
      } catch (err) {
        setError('Failed to load classes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchClasses();
    }
  }, [user?.email]);

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
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const now = new Date();
  const upcomingClasses = classes.filter(
    classInfo => new Date(classInfo.date + ' ' + classInfo.endTime) > now
  );
  const pastClasses = classes.filter(
    classInfo => new Date(classInfo.date + ' ' + classInfo.endTime) <= now
  );

  return (
    <Container className="my-classes-container">
      <h2 className="my-classes-header">My Classes</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 class-tabs"
      >
        <Tab eventKey="upcoming" title={`Upcoming (${upcomingClasses.length})`}>
          <UpcomingClasses classes={upcomingClasses} />
        </Tab>
        <Tab eventKey="past" title={`Past (${pastClasses.length})`}>
          <PastClasses classes={pastClasses} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MyClasses;