// AllClasses.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Dropdown,
  Badge
} from "react-bootstrap";
import Swal from "sweetalert2";

const AllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchClasses = async () => {
    const res = await fetch("http://localhost:5000/api/classes");
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const cancelClass = async (id, paymentStatus) => {
    if (paymentStatus === "paid") {
      return Swal.fire("Can't Cancel", "Paid classes cannot be cancelled.", "warning");
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!"
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`http://localhost:5000/api/classes/cancel/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        Swal.fire("Cancelled!", "Class has been cancelled.", "success");
        fetchClasses();
      } else {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  const filteredClasses = classes.filter(cls => {
    const today = new Date();
    const classDate = new Date(cls.classDate);
    const isUpcoming = classDate >= today;

    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Upcoming" && isUpcoming) ||
      (statusFilter === "Previous" && !isUpcoming);

    const paymentMatch =
      paymentFilter === "All" || cls.paymentStatus === paymentFilter.toLowerCase();

    return statusMatch && paymentMatch;
  });

  const sortedClasses = [...filteredClasses].sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.classDate) - new Date(b.classDate)
      : new Date(b.classDate) - new Date(a.classDate);
  });

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h4>All Classes <Badge bg="primary">{sortedClasses.length}</Badge></h4>
        </Col>
        <Col className="text-end d-flex justify-content-end gap-2">
          <Dropdown onSelect={(key) => setStatusFilter(key)}>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              {statusFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Upcoming">Upcoming</Dropdown.Item>
              <Dropdown.Item eventKey="Previous">Previous</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={(key) => setPaymentFilter(key)}>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              {paymentFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Paid">Paid</Dropdown.Item>
              <Dropdown.Item eventKey="Unpaid">Unpaid</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown onSelect={(key) => setSortOrder(key)}>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Sort: {sortOrder === "asc" ? "Oldest" : "Newest"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="asc">Oldest</Dropdown.Item>
              <Dropdown.Item eventKey="desc">Newest</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Class Date</th>
            <th>Teacher ID</th>
            <th>Student ID</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedClasses.map((cls, idx) => (
            <tr key={cls._id}>
              <td>{idx + 1}</td>
              <td>{new Date(cls.classDate).toLocaleDateString()}</td>
              <td>{cls.teacherId}</td>
              <td>{cls.studentId}</td>
              <td>
                <Badge bg={cls.status === "cancelled" ? "danger" : cls.status === "completed" ? "success" : "warning"}>{cls.status}</Badge>
              </td>
              <td>
                <Badge bg={cls.paymentStatus === "paid" ? "success" : "secondary"}>{cls.paymentStatus}</Badge>
              </td>
              <td>{new Date(cls.createdAt).toLocaleString()}</td>
              <td>
                {cls.status === "upcoming" && cls.paymentStatus !== "paid" && (
                  <Button size="sm" variant="danger" onClick={() => cancelClass(cls._id, cls.paymentStatus)}>
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllClasses;
