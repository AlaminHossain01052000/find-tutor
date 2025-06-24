import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';

import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { AdminDashboard } from '../../components/AdminDashboard/AdminDashboard';
import { TeacherDashboard } from '../../components/TeacherDashboard/TeacherDashboard';
import { StudentDashboard } from '../../components/StudentDashboard/StudentDashboard';


const Dashboard = () => {
  const { user,admin } = useAuth(); // Get authenticated user from your auth context
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user?.email) return;
        
        const response = await axios.get(`http://localhost:5000/api/users/byEmail?email=${(user.email)}`);
        
        if (!response.data) {
          throw new Error('User information not found');
        }
        
        setUserInfo(response.data);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const renderDashboard = () => {
    if (!userInfo) return null;
    console.log(admin)
    if(admin)
        return <AdminDashboard/>;
    switch (userInfo.userType) {
      
      case 'teacher':
        return <TeacherDashboard userInfo={userInfo} />;
      case 'student':
        return <StudentDashboard userInfo={userInfo} />;
      default:
        return <Alert variant="danger">Invalid user role</Alert>;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading dashboard</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      {renderDashboard()}
    </Container>
  );
};

export default Dashboard;