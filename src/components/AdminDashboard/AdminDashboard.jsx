// AdminDashboard.jsx
import  { useState } from "react";
import { Container, Nav, Tab, Row, Col, Card } from "react-bootstrap";
import AllTutors from "./AllTutors";
import AllUsers from "./AllUsers";
import AllClasses from "./AllClasses";
import AllTransactions from "./AllTransactions";


const AdminDashboard = () => {
  const [key, setKey] = useState("allUsers");

  return (
    <Container fluid className="mt-4 admin-dashboard">
      <Row>
        <Col md={3} className="mb-3">
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Admin Menu</Card.Header>
            <Nav variant="pills" className="flex-column p-2" activeKey={key} onSelect={(k) => setKey(k)}>
              <Nav.Item>
                <Nav.Link eventKey="allUsers">All Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="allClasses">All Classes</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="allTutors">All Tutors</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="allTransactions">All Transactions</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card>
        </Col>

        <Col md={9}>
          <Tab.Container activeKey={key}>
            <Tab.Content>
              <Tab.Pane eventKey="allUsers">
                <AllUsers></AllUsers>
              </Tab.Pane>

              <Tab.Pane eventKey="allClasses">
                <AllClasses/>
              </Tab.Pane>

              <Tab.Pane eventKey="allTutors">
                <AllTutors></AllTutors>
              </Tab.Pane>
              <Tab.Pane eventKey="allTransactions">
                <AllTransactions></AllTransactions>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
