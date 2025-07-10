import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Form,
  Button,
  Spinner,
  Row,
  Col,
  Badge,
  ButtonGroup,
} from "react-bootstrap";

const MyClasses = ({ teacherId }) => {
    console.log(teacherId)
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteLinks, setNoteLinks] = useState({});
  const [filter, setFilter] = useState("all"); // all | upcoming | previous

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/classes");
        const data = await res.json();
        const filtered = data.filter((cls) => cls.teacherId === teacherId);
        setClasses(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setLoading(false);
      }
    };
    fetchClasses();
  }, [teacherId]);

  const handleNoteChange = (classId, value) => {
    setNoteLinks((prev) => ({ ...prev, [classId]: value }));
  };

  const handleSaveNote = async (classId) => {
    const notesLink = noteLinks[classId];
    try {
      const res = await fetch(`http://localhost:5000/api/classes/${classId}/addNote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesLink }),
      });
      const updated = await res.json();
      setClasses((prev) =>
        prev.map((cls) => (cls._id === classId ? { ...cls, notesLink: updated.notesLink } : cls))
      );
    } catch (error) {
      console.error("Error updating notes link:", error);
    }
  };

  const handleStatusUpdate = async (classId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/classes/status/${classId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setClasses((prev) =>
        prev.map((cls) => (cls._id === classId ? { ...cls, status: updated.status } : cls))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getFilteredClasses = () => {
    let result = [...classes];
    if (filter === "upcoming") {
      result = result.filter((cls) => cls.status === "upcoming");
    } else if (filter === "previous") {
      result = result.filter((cls) => cls.status !== "upcoming");
    }
    return result.sort((a, b) => new Date(b.classDate) - new Date(a.classDate));
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container>
      <h4 className="mb-4">My Classes</h4>

      <ButtonGroup className="mb-3">
        <Button variant={filter === "all" ? "primary" : "outline-primary"} onClick={() => setFilter("all")}>All</Button>
        <Button variant={filter === "upcoming" ? "primary" : "outline-primary"} onClick={() => setFilter("upcoming")}>Upcoming</Button>
        <Button variant={filter === "previous" ? "primary" : "outline-primary"} onClick={() => setFilter("previous")}>Previous</Button>
      </ButtonGroup>

      {getFilteredClasses().length === 0 && <p>No classes to show.</p>}
      <Row>
        {getFilteredClasses().map((cls) => (
          <Col md={6} key={cls._id} className="mb-4">
            <Card className="p-3 shadow-sm">
              <h6><strong>Class Date:</strong> {new Date(cls.classDate).toLocaleString()}</h6>
              <p><strong>Status:</strong> <Badge bg={getStatusColor(cls.status)}>{cls.status}</Badge></p>
              <p><strong>Payment:</strong> <Badge bg={cls.paymentStatus === "paid" ? "success" : "danger"}>{cls.paymentStatus}</Badge></p>
              <p><strong>Transaction ID:</strong> {cls.transactionId || "N/A"}</p>

              {/* Notes input */}
              {cls.status === "completed" && (
                <Form>
                  <Form.Group>
                    <Form.Label>Notes (Google Drive Link)</Form.Label>
                    <Form.Control
                      type="url"
                      value={noteLinks[cls._id] || cls.notesLink || ""}
                      onChange={(e) => handleNoteChange(cls._id, e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleSaveNote(cls._id)}
                  >
                    Save Note
                  </Button>
                </Form>
              )}

              {/* Status update for upcoming */}
              {cls.status === "upcoming" && (
                <div className="mt-3 d-flex justify-content-between">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusUpdate(cls._id, "cancelled")}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate(cls._id, "completed")}
                  >
                    Mark Completed
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    case "upcoming":
      return "warning";
    default:
      return "secondary";
  }
};

export default MyClasses;
