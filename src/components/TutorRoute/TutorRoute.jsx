import { Spinner, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import React, { useEffect, useState } from 'react';


const TutorRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const {email} = user;
    const [tutorId,setTutorId] = useState(null)
    const [waiting,setWaiting]=useState(true)
    const [error,setError]=useState(null)
    useEffect(()=>{
        const fetchTeacher = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teacher_by_email?email=${email}`);
        if (!response.ok) throw new Error("Teacher not found");
        const data = await response.json();
        setTutorId(data._id);
        setError(null)
      } catch (error) {
        console.error("Error fetching teacher:", error);
        setError(error.message);
      }
      finally{
    
        setWaiting(false)
      }
    };

    fetchTeacher();
    },[email])
    if (loading ||waiting) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }
    if(error){
        return (
            <div>{error}</div>
        )
    }

    return tutorId?React.cloneElement(children, { teacherId:tutorId }):<Navigate to="/login" />;
    
};

export default TutorRoute;