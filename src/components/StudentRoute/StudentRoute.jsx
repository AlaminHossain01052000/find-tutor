import { Spinner, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import React, { useEffect, useState } from 'react';

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { email } = user || {}; // Ensure user is not null
  const [studentId, setStudentId] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) return;

    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/student_by_email?email=${email}`);
        if (!response.ok) throw new Error("Student not found");
        const data = await response.json();
        setStudentId(data._id);
        setError(null);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError(err.message);
      } finally {
        setWaiting(false);
      }
    };

    fetchStudent();
  }, [email]);

  if (loading || waiting) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return studentId
    ? React.cloneElement(children, { studentId })
    : <Navigate to="/login" />;
};

export default StudentRoute;
