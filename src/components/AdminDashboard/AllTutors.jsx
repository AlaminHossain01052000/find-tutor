// AllTutors.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Card,
  Dropdown
} from "react-bootstrap";

const AllTutors = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");

  const fetchTeachers = async () => {
    const res = await fetch("http://localhost:5000/api/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`http://localhost:5000/api/teachers/approve/${id}`, {
      method: "PATCH",
    });
    if (res.ok) {
      fetchTeachers();
      setShowModal(false);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    if (filter === "All") return true;
    return t.approvalStatus === filter.toLowerCase();
  });

  const approvedCount = teachers.filter((t) => t.approvalStatus === "approved").length;

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h4>All Tutors <Badge bg="success">Approved: {approvedCount}</Badge></h4>
        </Col>
        <Col className="text-end">
          <Dropdown onSelect={(key) => setFilter(key)}>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Filter: {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
              <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher, index) => (
            <tr key={teacher._id}>
              <td>{index + 1}</td>
              <td>{teacher.firstName} {teacher.lastName}</td>
              <td>{teacher.email}</td>
              <td>
                <Badge bg={teacher.approvalStatus === "approved" ? "success" : "warning"}> 
                  {teacher.approvalStatus}
                </Badge>
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => { setSelectedTeacher(teacher); setShowModal(true); }}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedTeacher && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Tutor Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center">
                <img src={selectedTeacher.profilePic} alt="Tutor" className="img-fluid rounded-circle mb-3" style={{ maxHeight: "150px" }} />
                <h5>{selectedTeacher.firstName} {selectedTeacher.lastName}</h5>
                <p className="text-muted">{selectedTeacher.email}</p>
                <Badge bg={selectedTeacher.approvalStatus === "approved" ? "success" : "warning"}>{selectedTeacher.approvalStatus}</Badge>
              </Col>
              <Col md={8}>
                <Card className="p-3">
                  <p><strong>Educational Qualification:</strong> {selectedTeacher.educationalQualification}</p>
                  <p><strong>Categories:</strong> {selectedTeacher.categories.join(", ")}</p>
                  <p><strong>Charge/Hour:</strong> ${selectedTeacher.chargePerHour}</p>
                  <p><strong>Date of Birth:</strong> {selectedTeacher.dob}</p>
                  <p><strong>Documents:</strong> <a href={selectedTeacher.documents} target="_blank" rel="noreferrer">View Document</a></p>
                  <p><strong>Total Ratings:</strong> {selectedTeacher.totalRatings}</p>
                  <p><strong>Rating:</strong> {selectedTeacher.rating}</p>
                  <p><strong>Balance:</strong> ${selectedTeacher.balance}</p>
                  <p><strong>Email Verified:</strong> {selectedTeacher.emailVerified ? "Yes" : "No"}</p>
                </Card>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            {selectedTeacher.approvalStatus !== "approved" && (
              <Button variant="success" onClick={() => handleApprove(selectedTeacher._id)}>
                Approve Teacher
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AllTutors;