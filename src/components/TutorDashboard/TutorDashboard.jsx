import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./TutorDashboard.css";
import MyClasses from "./MyClasses";
import MyProfile from "./MyProfile";
import MyWallet from "./MyWallet";

const TutorDashboard = ({teacherId}) => {
  const [activeSection, setActiveSection] = useState("classes");

  const renderSection = () => {
    switch (activeSection) {
      case "classes":
        return <MyClasses teacherId={teacherId}></MyClasses>;
      case "profile":
        return <MyProfile teacherId={teacherId}></MyProfile>;
      case "wallet":
        return <MyWallet teacherId={teacherId}></MyWallet>;
      default:
        return null;
    }
  };

  return (
    <Container fluid className="tutor-dashboard">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="sidebar p-3 shadow-sm">
          <h4 className="mb-4">Tutor Dashboard</h4>
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
          <Button
            variant={activeSection === "wallet" ? "primary" : "outline-primary"}
            className="w-100"
            onClick={() => setActiveSection("wallet")}
          >
            My Wallet
          </Button>
        </Col>

        {/* Content */}
        <Col md={9} className="p-4 content-area">
          <Card className="p-4 shadow-sm">
            {renderSection()}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TutorDashboard;
