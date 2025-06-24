import React, { useState, useEffect } from 'react';
import { 
  Container, Card, Button, Row, Col, Form, 
  Table, Badge, Alert, Modal, ListGroup, Spinner
} from 'react-bootstrap';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';


export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    qualification: '',
    categories: [],
    profilePic: '',
    balance: 0,
    availability: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [timeSlot, setTimeSlot] = useState({ start: '', end: '' });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/byEmail?email=${user.email}`);
        setTeacherData({
          ...response.data,
          availability: response.data?.availability || {}
        });
      } catch (err) {
        setError('Failed to load teacher data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user.email]);

  const handleAddTimeSlot = () => {
    if (!timeSlot.start || !timeSlot.end) return;

    // Convert to BST (UTC+6)
    const startTime = new Date(`1970-01-01T${timeSlot.start}:00Z`);
    startTime.setHours(startTime.getHours() + 6);
    const endTime = new Date(`1970-01-01T${timeSlot.end}:00Z`);
    endTime.setHours(endTime.getHours() + 6);

    // Check for conflicts
    const hasConflict = teacherData.availability[currentDay]?.some(slot => {
      const existingStart = new Date(`1970-01-01T${slot.start}:00Z`);
      existingStart.setHours(existingStart.getHours() + 6);
      const existingEnd = new Date(`1970-01-01T${slot.end}:00Z`);
      existingEnd.setHours(existingEnd.getHours() + 6);

      return (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      );
    });

    if (hasConflict) {
      setError('Time slot conflicts with existing schedule');
      return;
    }

    setTeacherData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [currentDay]: [...(prev.availability[currentDay] || []), {
          start: timeSlot.start,
          end: timeSlot.end,
          id: Date.now()
        }]
      }
    }));

    setTimeSlot({ start: '', end: '' });
    setError('');
  };

  const handleRemoveSlot = (day, id) => {
    setTeacherData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter(slot => slot.id !== id)
      }
    }));
  };

  const handleSaveChanges = async () => {
  try {
    // Create a clean copy without React-specific properties
    const cleanTeacherData = {
      ...teacherData,
      availability: teacherData.availability
    };
    
    // Remove the _id field if it exists
    delete cleanTeacherData._id;

    const response = await fetch(`http://localhost:5000/api/users/${user.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanTeacherData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update schedule');
    }

    alert('Schedule updated successfully!');
    setError('');
  } catch (err) {
    setError(err.message);
    console.error(err);
  }
};

  const handleWithdraw = () => {
    alert(`Withdraw request for ৳${withdrawAmount} submitted!`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
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

  return (
    <Container className="my-5">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Teacher Profile</Card.Title>
              <div className="text-center mb-3">
                {teacherData.profilePic && (
                  <img 
                    src={`/uploads/${teacherData.profilePic}`} 
                    alt="Profile" 
                    className="rounded-circle mb-2" 
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                )}
                <h4>{teacherData.firstName} {teacherData.lastName}</h4>
                <p className="text-muted">{teacherData.qualification}</p>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Email:</strong> {teacherData.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Mobile:</strong> {teacherData.mobile}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Categories:</strong> {teacherData.categories?.join(', ')}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Balance</Card.Title>
              <h2 className="text-primary">৳{teacherData.balance || 0}</h2>
              <Button 
                variant="success" 
                className="w-100 mt-3"
                onClick={() => setShowWithdrawModal(true)}
              >
                Withdraw
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Your Availability
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <div className="d-flex flex-wrap gap-2 mb-4">
                {daysOfWeek.map(day => (
                  <Button
                    key={day}
                    variant={teacherData.availability[day] ? 'primary' : 'outline-primary'}
                    onClick={() => {
                      setCurrentDay(day);
                      setShowTimeModal(true);
                    }}
                  >
                    {day} 
                    {teacherData.availability[day] && (
                      <Badge bg="light" text="dark" className="ms-1">
                        {teacherData.availability[day].length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {Object.keys(teacherData.availability).some(day => teacherData.availability[day]?.length > 0) ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time Slots (BST - UTC+6)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daysOfWeek.map(day => (
                      teacherData.availability[day]?.length > 0 && (
                        <tr key={day}>
                          <td>{day}</td>
                          <td>
                            {teacherData.availability[day].map(slot => (
                              <Badge key={slot.id} bg="info" className="me-2">
                                {slot.start} - {slot.end}
                              </Badge>
                            ))}
                          </td>
                          <td>
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => {
                                const newAvailability = {...teacherData.availability};
                                delete newAvailability[day];
                                setTeacherData(prev => ({
                                  ...prev,
                                  availability: newAvailability
                                }));
                              }}
                            >
                              Clear All
                            </Button>
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No availability set yet. Click on days to add your available time slots.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Time Slot Modal */}
      <Modal show={showTimeModal} onHide={() => setShowTimeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Time Slots for {currentDay}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control 
              type="time" 
              value={timeSlot.start}
              onChange={(e) => setTimeSlot({...timeSlot, start: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control 
              type="time" 
              value={timeSlot.end}
              onChange={(e) => setTimeSlot({...timeSlot, end: e.target.value})}
              min={timeSlot.start}
            />
          </Form.Group>
          <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>

          {teacherData.availability[currentDay]?.length > 0 && (
            <div className="mt-3">
              <h6>Current Slots:</h6>
              <ListGroup>
                {teacherData.availability[currentDay]?.map(slot => (
                  <ListGroup.Item key={slot.id} className="d-flex justify-content-between align-items-center">
                    {slot.start} - {slot.end} (BST)
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemoveSlot(currentDay, slot.id)}
                    >
                      ×
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Withdraw Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Amount (BDT)</Form.Label>
            <Form.Control 
              type="number" 
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={`Maximum: ৳${teacherData.balance || 0}`}
              max={teacherData.balance}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleWithdraw}
            disabled={!withdrawAmount || withdrawAmount > teacherData.balance}
          >
            Request Withdrawal
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

