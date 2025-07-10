// AllTransactions.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  Badge
} from "react-bootstrap";

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("date");

  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:5000/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === "amount") {
      return b.amount - a.amount;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h4>All Transactions <Badge bg="primary">{sortedTransactions.length}</Badge></h4>
        </Col>
        <Col className="text-end">
          <Dropdown onSelect={(key) => setSortBy(key)}>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Sort by: {sortBy === "amount" ? "Amount" : "Date"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="date">Date</Dropdown.Item>
              <Dropdown.Item eventKey="amount">Amount</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Teacher ID</th>
            <th>Student ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((trx, idx) => (
            <tr key={trx._id}>
              <td>{idx + 1}</td>
              <td>{trx.teacherId}</td>
              <td>{trx.studentId}</td>
              <td>${trx.amount}</td>
              <td>{new Date(trx.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllTransactions;
