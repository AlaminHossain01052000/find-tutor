import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import StudentProfile from "./StudentProfile";
import StudentClasses from "./StudentClasses";

const StudentDashboard = ({ studentId }) => {
  const [activeSection, setActiveSection] = useState("classes");

  const renderSection = () => {
    switch (activeSection) {
      case "classes":
        return (
          <StudentClasses
            studentId={studentId}
            onCancelClass={handleCancelClass}
          />
        );
      case "profile":
        return <StudentProfile studentId={studentId} />;
    
      default:
        return null;
    }
  };

  const handleCancelClass = (classId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this upcoming class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // API call to cancel class
        console.log("Class canceled:", classId);
        Swal.fire("Cancelled!", "Your class has been cancelled.", "success");
      }
    });
  };

  return (
    <Container fluid className="student-dashboard">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="sidebar p-3 shadow-sm">
          <h4 className="mb-4">Student Dashboard</h4>
          <Button
            variant={activeSection === "classes" ? "primary" : "outline-primary"}
            className="w-100 mb-2"
            onClick={() => setActiveSection("classes")}
          >
            My Classes
          </Button>
          <Button
            variant={activeSection === "profile" ? "primary" : "outline-primary"}
            className="w-100 mb-2"
            onClick={() => setActiveSection("profile")}
          >
            My Profile
          </Button>
         
        </Col>

        {/* Content */}
        <Col md={9} className="p-4 content-area">
          <Card className="p-4 shadow-sm">{renderSection()}</Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
