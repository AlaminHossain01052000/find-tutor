import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, ToggleButton, ButtonGroup, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Registration = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'student', // or 'teacher'
  // Teacher-specific fields
  mobile: '',
  qualification: '',
  categories: [],
  nid: null,         // File object
  documents: null,    // File object
  profilePic: null,   // File object
  introVideo: null,    // File object (optional)
  approvalStatus:"pending"
});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate=useNavigate();
  const {registerNewUser}=useAuth()
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (['nid', 'documents', 'profilePic', 'introVideo'].includes(name)) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, value] 
        : prev.categories.filter(cat => cat !== value)
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Teacher validations
    if (userType === 'teacher') {
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
      if (!formData.nid) newErrors.nid = 'NID document is required';
      if (!formData.documents) newErrors.documents = 'Educational documents are required';
      if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
      if (formData.categories.length === 0) newErrors.categories = 'At least one category must be selected';
      
      // File type validations
      if (formData.nid && !['application/pdf', 'image/jpeg', 'image/png'].includes(formData.nid.type)) {
        newErrors.nid = 'Only PDF, JPEG, or PNG files are allowed';
      }
      if (formData.profilePic && !['image/jpeg', 'image/png'].includes(formData.profilePic.type)) {
        newErrors.profilePic = 'Only JPEG or PNG images are allowed';
      }
      if (formData.introVideo && !['video/mp4', 'video/quicktime'].includes(formData.introVideo.type)) {
        newErrors.introVideo = 'Only MP4 or MOV videos are allowed';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setSuccess(false);
    
    try {
      formData.userType=userType

      
      const config = {
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      }
    };

    try {
      const success = await registerNewUser(formData, config, navigate);
      if (success) {
        alert('Registration successful! Please verify your email.');
        navigate('/login');
      }
    } catch (error) {
      // Error is already handled in useFirebase
      console.log(error)
    }
      // await axios.post('http://localhost:5000/api/users', formPayload, config);
      
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        qualification: '',
        categories: [],
        nid: null,
        documents: null,
        profilePic: null,
        introVideo: null
      });
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({
        submit: err.response?.data?.message || 
               err.response?.data?.error || 
               'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const categoriesOptions = [
    'Programming', 'Music', 'Language', 
    'Mathematics', 'Science'
  ];

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Register for Find Tutor</h2>
          
          <ButtonGroup className="w-100 mb-4">
            <ToggleButton
              id="student-toggle"
              type="radio"
              variant={userType === 'student' ? 'primary' : 'outline-primary'}
              checked={userType === 'student'}
              onChange={() => setUserType('student')}
              value="student"
            >
              Student
            </ToggleButton>
            <ToggleButton
              id="teacher-toggle"
              type="radio"
              variant={userType === 'teacher' ? 'primary' : 'outline-primary'}
              checked={userType === 'teacher'}
              onChange={() => setUserType('teacher')}
              value="teacher"
            >
              Teacher
            </ToggleButton>
          </ButtonGroup>
          
          {success && <Alert variant="success">Registration successful!</Alert>}
          {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
          
          
             <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            {userType === 'teacher' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    isInvalid={!!errors.mobile}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Educational Qualification</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    isInvalid={!!errors.qualification}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.qualification}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Select Categories</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {categoriesOptions.map(category => (
                      <Form.Check
                        key={category}
                        type="checkbox"
                        id={`category-${category}`}
                        label={category}
                        value={category}
                        checked={formData.categories.includes(category)}
                        onChange={handleCategoryChange}
                        inline
                      />
                    ))}
                  </div>
                  {errors.categories && (
                    <div className="text-danger small mt-1">{errors.categories}</div>
                  )}
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>NID Document</Form.Label>
                      <Form.Control
                        type="file"
                        name="nid"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        isInvalid={!!errors.nid}
                      />
                      <Form.Text muted>Upload a clear copy of your NID</Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.nid}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Educational Documents</Form.Label>
                      <Form.Control
                        type="file"
                        name="documents"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        isInvalid={!!errors.documents}
                      />
                      <Form.Text muted>Upload your certificates</Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.documents}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Picture</Form.Label>
                      <Form.Control
                        type="file"
                        name="profilePic"
                        onChange={handleChange}
                        accept=".jpg,.jpeg,.png"
                        isInvalid={!!errors.profilePic}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.profilePic}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Introduction Video (Optional)</Form.Label>
                      <Form.Control
                        type="file"
                        name="introVideo"
                        onChange={handleChange}
                        accept=".mp4,.mov,.avi"
                      />
                      <Form.Text muted>Short video introducing yourself</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
            
           
         
            <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
              {loading ? 'Processing...' : 'Register'}
            </Button>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;