import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Form,
    Button,
    Row,
    Col,
    Card,
    Alert,
    Badge,
    Image
} from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';


const StudentProfile = ({ studentId }) => {
    const { updateStudentPassword } = useAuth();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [message, setMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [updateable, setUpdateable] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        profilePic: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch(`http://localhost:5000/api/students/${studentId}`);
            const data = await res.json();
            setStudent(data);
            setNewPassword(data.password);
            setProfileData({
                firstName: data.firstName,
                lastName: data.lastName,
                dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
                profilePic: data.profilePic
            });
        };
        fetchProfile();
    }, [studentId]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/students/${studentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });
            const updated = await res.json();
            setStudent(updated);
            setMessage("Profile updated successfully");
        } catch (err) {
            setMessage("Failed to update profile");
        }
    };

    const handlePasswordUpdate = async() => {
        if (updateable) {
            if (newPassword.length < 6) {
                alert("Password must be more than 6 length");
                return
            }
            await updateStudentPassword(newPassword, navigate, studentId, newPassword, newPassword)
            setUpdateable(!updateable)
        }
        else setUpdateable(!updateable)
    }

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!student) return <p>Loading...</p>;

    return (
        <Container className="student-profile">
            <h3>Student Profile</h3>
            {message && <Alert variant="info">{message}</Alert>}
            
            <Form onSubmit={handleProfileUpdate} className="mb-4">
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                name="firstName" 
                                value={profileData.firstName}
                                onChange={handleProfileChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                name="lastName" 
                                value={profileData.lastName}
                                onChange={handleProfileChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                name="email" 
                                value={student.email} 
                                readOnly 
                            />
                            <Badge bg={student.emailVerified ? "success" : "danger"} className="mt-1">
                                {student.emailVerified ? "Verified" : "Not Verified"}
                            </Badge>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <div className="d-flex">
                                <Form.Control 
                                    name="password" 
                                    value={newPassword} 
                                    type={passwordVisible ? 'text' : 'password'} 
                                    readOnly={!updateable} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                />
                                <Button 
                                    variant={updateable ? "success" : "warning"}
                                    className="fw-bold px-4 ms-1" 
                                    onClick={handlePasswordUpdate}
                                >
                                    {updateable ? "Save Password" : "Update Password"}
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    className="fw-bold px-4 ms-1" 
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? "Hide" : "Show"}
                                </Button>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control 
                                type="date" 
                                name="dob" 
                                value={profileData.dob}
                                onChange={handleProfileChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Profile Picture URL</Form.Label>
                            <Form.Control 
                                type="url" 
                                name="profilePic" 
                                value={profileData.profilePic}
                                onChange={handleProfileChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                
                <div className="text-center my-3">
                    {profileData.profilePic && (
                        <Image 
                            src={profileData.profilePic} 
                            roundedCircle 
                            width={150} 
                            height={150} 
                            className="border border-primary"
                            alt="Profile"
                        />
                    )}
                </div>
                
                <Button className="mt-2" type="submit">Update Profile</Button>
            </Form>
            
            <Card className="mt-4">
                <Card.Header>
                    <h5>Account Information</h5>
                </Card.Header>
                <Card.Body>
                    <p><strong>Account Created:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(student.updatedAt || student.createdAt).toLocaleDateString()}</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentProfile;