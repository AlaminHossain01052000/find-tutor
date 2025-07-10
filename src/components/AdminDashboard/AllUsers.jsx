// AllUsers.jsx
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
import useAuth from '../../hooks/useAuth'

const AllUsers = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const {deleteUser}=useAuth();
  const [loading,setLoading]=useState(true)
  const fetchUsers = async () => {
    setLoading(true)
    const resTeachers = await fetch("http://localhost:5000/api/teachers");
    const resStudents = await fetch("http://localhost:5000/api/students");
    const teacherData = await resTeachers.json();
    const studentData = await resStudents.json();
   
    setTeachers(teacherData);
    setStudents(studentData);
    setLoading(false)
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteAUser = async (email,role,id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      const res=await deleteUser(email,role,id)
      console.log("allusers",res)
      fetchUsers()

    }
  };

  const getFilteredUsers = () => {
    let list = [];
    if (filter === "Teacher") list = teachers.map(t => ({ ...t, role: "teacher" }));
    else if (filter === "Student") list = students.map(s => ({ ...s, role: "student" }));
    else list = [...teachers.map(t => ({ ...t, role: "teacher" })), ...students.map(s => ({ ...s, role: "student" }))];

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const users = getFilteredUsers();
  if(loading){
    return(
      <div>
        Loading...
      </div>
    )
  }
  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h4>All Users <Badge bg="primary">{users.length}</Badge></h4>
        </Col>
        <Col className="text-end">
          <Dropdown onSelect={(key) => setFilter(key)}>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Filter: {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Teacher">Teacher</Dropdown.Item>
              <Dropdown.Item eventKey="Student">Student</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user._id}>
              <td>{idx + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === "teacher" ? "info" : "secondary"}>{user.role}</Badge>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteAUser(user.email,user.role,user._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AllUsers;