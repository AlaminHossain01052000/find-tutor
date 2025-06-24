import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const TutorApproval = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  

  useEffect(() => {
    const fetchPendingTutors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setTutors(response.data.filter(t => t.userType === 'teacher' && !t.isApproved &&(t?.approvalStatus!='rejected')));
      } catch (err) {
        setError('Failed to fetch tutors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTutors();
  }, []);

  const downloadFile = async (filePath, fileType) => {
  try {
    // Convert backslashes to forward slashes and encode the filename
    const encodedPath = encodeURIComponent(filePath.replace(/\\/g, '/'));
    const response = await axios.get(`http://localhost:5000/api/files/${encodedPath}`, {
      responseType: 'blob'
    });
    
    // Extract filename from path
    const filename = filePath.split('\\').pop() || filePath.split('/').pop();
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    setError(`Failed to download ${fileType}`);
    console.error('Download error:', err);
  }
};

  const handleApprove = async (tutor) => {
    try {
      // Create a copy without _id
      const { _id, ...tutorData } = tutor;
      await axios.put(`http://localhost:5000/api/users/${tutor.email}`, {
        ...tutorData,
        isApproved: true,
        approvalStatus: 'approved'
      });
      setTutors(tutors.filter(t => t.email !== tutor.email));
      alert('Tutor approved successfully');
    } catch (err) {
      setError('Approval failed');
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      setEmailSending(true);
      const { _id, ...tutorData } = selectedTutor;
      
      // Update tutor status first
      await axios.put(`http://localhost:5000/api/users/${selectedTutor.email}`, {
        ...tutorData,
        isApproved: false,
        approvalStatus: 'rejected',
        rejectionReason,
        checked: true
      });

      // Send rejection email
      const templateParams = {
        to_email: selectedTutor.email,
        message: rejectionReason,
      };
      
      await emailjs.send(
        'service_f29mwnq', 
        'template_r47mnrf', 
        templateParams, 
        'ExZoup8ZCGDP-bVZk'
      );

      setTutors(tutors.filter(t => t.email !== selectedTutor.email));
      setShowModal(false);
      setRejectionReason('');
      alert('Tutor rejected and notified');
    } catch (err) {
      setError(err.message || 'Rejection failed');
      console.error(err);
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="mt-4">
      <h3>Pending Tutor Approvals</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Qualifications</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutors.length > 0 ? (
            tutors.map(tutor => (
              <tr key={tutor._id}>
                <td>{tutor.firstName} {tutor.lastName}</td>
                <td>{tutor.email}</td>
                <td>{tutor.qualification}</td>
                <td>
                  {tutor.nid && (
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => downloadFile(tutor.nid, 'NID')}
                    >
                      Download NID
                    </Button>
                  )}
                  {tutor.documents && (
                    <Button 
                      variant="info" 
                      size="sm"
                      onClick={() => downloadFile(tutor.documents, 'Documents')}
                    >
                      Download Certificates
                    </Button>
                  )}
                </td>
                <td>
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleApprove(tutor)}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => {
                      setSelectedTutor(tutor);
                      setShowModal(true);
                    }}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No pending approvals</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Rejection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Tutor Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Rejection Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why the tutor is being rejected..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject}
            disabled={emailSending}
          >
            {emailSending ? 'Sending...' : 'Confirm Rejection'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TutorApproval;