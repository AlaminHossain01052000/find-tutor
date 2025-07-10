import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import './TeacherRegistration.css';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const TeacherRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    educationalQualification: '',
    categories: [],
    documents: '',
    profilePic: '',
    chargePerHour: '',
    dob: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {registerNewUser}=useAuth()
  const navigate=useNavigate()
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => {
        const newCategories = checked
          ? [...prev.categories, value]
          : prev.categories.filter((cat) => cat !== value);
        return { ...prev, categories: newCategories };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    if (age < 18) {
      return setError('You must be at least 18 years old.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    const teacherData = {
      ...formData,
      totalRatings: 0,
      rating: 0,
      balance: 0,
      slots: [],
      createdAt: new Date(),
      approvalStatus:"pending",
      emailVerified:false
    };

    try {
      const res = await registerNewUser(teacherData,'tutor',navigate);
      if(res.status===201){
            setSuccess('Registration successful!');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            educationalQualification: '',
            categories: [],
            documents: '',
            profilePic: '',
            chargePerHour: '',
            dob: '',
          });
      }
      else  throw new Error("Something went wrong! Please Try Again");
    
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Container className="teacher-registration mt-5">
      <h2 className="text-center mb-4">Teacher Registration</h2>
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
          <Form.Label>Educational Qualification</Form.Label>
          <Form.Control type="text" name="educationalQualification" value={formData.educationalQualification} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Categories</Form.Label>
          <div className="categories-checkbox">
            {['Programming', 'Music', 'Language', 'Mathematics', 'Science', 'Others'].map((cat) => (
              <Form.Check
                key={cat}
                inline
                label={cat}
                name="categories"
                type="checkbox"
                value={cat}
                onChange={handleChange}
                checked={formData.categories.includes(cat)}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Documents Link</Form.Label>
          <Form.Control
            type="url"
            name="documents"
            placeholder="Upload your NID, educational qualifications, or other certificates in Google Drive. Make the link accessible and paste here."
            value={formData.documents}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Picture URL</Form.Label>
          <Form.Control type="url" name="profilePic" value={formData.profilePic} onChange={handleChange} required />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Charge Per Hour (BDT)</Form.Label>
              <Form.Control type="number" name="chargePerHour" value={formData.chargePerHour} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="w-100">Register</Button>
      </Form>
    </Container>
  );
};

export default TeacherRegistration;
