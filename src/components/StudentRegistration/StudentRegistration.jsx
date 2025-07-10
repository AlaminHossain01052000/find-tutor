import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import './StudentRegistration.css';
import useAuth from '../../hooks/useAuth';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const StudentRegistration = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        profilePic: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { registerNewUser } = useAuth();
    const navigate=useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const age = calculateAge(formData.dob);
        if (age < 16) {
            return setError('You must be at least 16 years old.');
        }

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }

        const studentData = {
            ...formData,
            emailVerified: false,
            createdAt: new Date(),
        };

        try {
            const res = await registerNewUser(studentData, 'student',navigate);


            setSuccess('Registration successful!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                dob: '',
                profilePic: '',
            });






        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <Container className="student-registration mt-5">
            <h2 className="text-center mb-4">Student Registration</h2>
            <Form onSubmit={handleSubmit} className="registration-form">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Profile Picture URL <small className="text-muted">(optional)</small></Form.Label>
                    <Form.Control type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                    Register
                </Button>
            </Form>
            <h6 className='text-center mt-3'>Register as <Link to="/register/tutor" className='fw-bold btn btn-dark'>Tutor</Link></h6>
        </Container>
    );
};

export default StudentRegistration;
