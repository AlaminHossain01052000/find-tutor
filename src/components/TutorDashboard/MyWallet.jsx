// MyWallet.jsx
import  { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Dropdown,
} from "react-bootstrap";
import "./MyWallet.css";

const MyWallet = ({ teacherId }) => {
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [message, setMessage] = useState("");

  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:5000/api/transactions");
    const data = await res.json();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const filtered = data.filter(
      (tx) =>
        tx.teacherId === teacherId &&
        new Date(tx.createdAt) >= last30Days
    );

    const sorted = sortTransactions(filtered, sortBy);
    setTransactions(sorted);
  };

  useEffect(() => {
    fetchTransactions();
  }, [sortBy]);

  const sortTransactions = (list, type) => {
    if (type === "amount") {
      return [...list].sort((a, b) => b.amount - a.amount);
    }
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const totalBalance = transactions.reduce((acc, tx) => acc + Number(tx.amount), 0);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > totalBalance) {
      return setMessage("❌ Cannot withdraw more than available balance");
    }
    if (amount <= 0) {
      return setMessage("❌ Please enter a valid amount");
    }

    // placeholder only, implement withdrawal logic later
    setMessage(`✅ Withdrawal request for $${amount} submitted.`);
    setWithdrawAmount("");
  };

  return (
    <Container className="my-wallet mt-4">
      <Row className="mb-3">
        <Col md={6}>
          <h4>💰 My Wallet</h4>
        </Col>
        <Col md={6} className="text-end">
          <Dropdown onSelect={(key) => setSortBy(key)}>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Sort by: {sortBy === "recent" ? "Most Recent" : "Most Amount"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="recent">Most Recent</Dropdown.Item>
              <Dropdown.Item eventKey="amount">Most Amount</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Card className="mb-3 p-3 text-center shadow-sm">
        <h5 className="fw-bold">Current Balance</h5>
        <h3 className="text-success">${totalBalance.toFixed(2)}</h3>
        <Row className="justify-content-center align-items-center mt-2">
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </Col>
          <Col md="auto">
            <Button variant="primary" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </Col>
        </Row>
        {message && <p className="text-info mt-2">{message}</p>}
      </Card>

      <h5 className="mb-3">Recent Transactions (Last 30 Days)</h5>
      <Table striped bordered hover responsive className="wallet-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Class ID</th>
            <th>Student ID</th>
            <th>Amount ($)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No transactions in the last 30 days.
              </td>
            </tr>
          ) : (
            transactions.map((tx, index) => (
              <tr key={tx._id}>
                <td>{index + 1}</td>
                <td>{tx.classId}</td>
                <td>{tx.studentId}</td>
                <td>{tx.amount}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyWallet;
