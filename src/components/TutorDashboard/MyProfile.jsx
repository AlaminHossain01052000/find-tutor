// MyProfile.jsx
import React, { useEffect, useState } from "react";
import {
    Container,
    Form,
    Button,
    Row,
    Col,
    Card,
    Alert,
    Badge,
} from "react-bootstrap";
import "./MyProfile.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const days = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];
const times = generateTimes();

function generateTimes() {
    const slots = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h % 12 === 0 ? 12 : h % 12;
            const ampm = h < 12 ? "am" : "pm";
            const minutes = m === 0 ? "00" : m;
            slots.push(`${hour}:${minutes} ${ampm}`);
        }
    }
    return slots;
}

const MyProfile = ({ teacherId }) => {
    const [teacher, setTeacher] = useState(null);
    const [newSlot, setNewSlot] = useState({ day: "sat", time: "12:00 am" });
    const [message, setMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [updateable, setUpdateable] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const { updateUserPassword } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch(`http://localhost:5000/api/teachers/${teacherId}`);
            const data = await res.json();
            setTeacher(data);
            setNewPassword(data.password)
        };
        fetchProfile();
    }, [teacherId]);

    const addSlot = async () => {
        const existingSlots = teacher.slots?.filter(slot => slot.day === newSlot.day);
        const newTimeIndex = times?.indexOf(newSlot.time);

        const hasConflict = existingSlots?.some(slot => {
            const index = times?.indexOf(slot.time);
            return Math.abs(index - newTimeIndex) < 2;
        });

        if (hasConflict) {
            return setMessage("Slot conflict detected: must be 1 hour apart");
        }
        newSlot.isBooked=false;
        const res = await fetch(`http://localhost:5000/api/teachers/add-slot/${teacherId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSlot),
        });
        const data = await res.json()
        if (res.ok)
            setTeacher(data)


        setMessage("Slot added successfully");
    };

    const deleteSlot = async (day, time) => {
        const res = await fetch(`http://localhost:5000/api/teachers/delete-slot/${teacherId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, time }),
        });
        const data = await res.json()
        if (res.ok)
            setTeacher(data)
        setMessage("Slot deleted successfully");
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const profileData = Object.fromEntries(form.entries());
        const res = await fetch(`http://localhost:5000/api/teachers/${teacherId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
        });
        const updated = await res.json();
        setTeacher(updated);
        setMessage("Profile updated");
    };
    const handlePasswordUpdate = async() => {
        if (updateable) {
            if (newPassword.length < 6) {
                alert("Password must be more than 6 length");
                return
            }
            await updateUserPassword(newPassword, navigate, teacherId, newPassword, newPassword)
            setUpdateable(!updateable)
        }
        else setUpdateable(!updateable)
    }
    if (!teacher) return <p>Loading...</p>;

    return (
        <Container className="my-profile">
            <h3>My Profile</h3>
            {message && <Alert variant="info">{message}</Alert>}
            <Form onSubmit={handleProfileUpdate} className="mb-4">
                <Row>
                    <Col md={6}><Form.Group><Form.Label>First Name</Form.Label><Form.Control name="firstName" defaultValue={teacher.firstName} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Last Name</Form.Label><Form.Control name="lastName" defaultValue={teacher.lastName} /></Form.Group></Col>
                </Row>
                <Row>
                    <Col md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control name="email" defaultValue={teacher.email} readOnly /></Form.Group></Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <div className="d-flex">
                                <Form.Control name="password" defaultValue={newPassword} type={passwordVisible ? 'text' : 'password'} readOnly={!updateable} onChange={(e) => setNewPassword(e.target.value)} />
                                <button type="button" className="btn btn-warning  fw-bold px-4 ms-1" onClick={() => handlePasswordUpdate()}>{!updateable ? "Update Password" : "Update"}</button>
                                <button type="button" className="btn btn-danger fw-bold px-4 ms-1" onClick={() => setPasswordVisible(!passwordVisible)}>View</button>
                            </div>

                        </Form.Group>

                    </Col>

                </Row>
                <Form.Group><Form.Label>Educational Qualification</Form.Label><Form.Control name="educationalQualification" defaultValue={teacher.educationalQualification} /></Form.Group>
                <Form.Group><Form.Label>Charge Per Hour</Form.Label><Form.Control name="chargePerHour" defaultValue={teacher.chargePerHour} /></Form.Group>
                <Button className="mt-2" type="submit">Update Profile</Button>
            </Form>

            <h4>Manage Slots</h4>
            <Form className="d-flex gap-2 mb-3">
                <Form.Select className="w-50" onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}>{days.map(day => <option key={day}>{day}</option>)}</Form.Select>
                <div className="w-50 d-flex gap-1">
                    <Form.Select className="w-75" onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}>{times.map(time => <option key={time}>{time}</option>)}</Form.Select>
                    <Button onClick={addSlot} className="px-4 w-25">Add Slot</Button>
                </div>

            </Form>

            <Row>
                {days.map(day => (
                    <Col md={4} key={day} className="mb-3">
                        <Card><Card.Body>
                            <h6>{day.toUpperCase()}</h6>
                            {teacher.slots?.filter(slot => slot.day === day).map((slot, index) => (
                                <div key={index} className="d-flex justify-content-between mb-1">
                                    <Badge bg="secondary">{slot.time}</Badge>
                                    <Button variant="danger" size="sm" onClick={() => deleteSlot(day, slot.time)}>X</Button>
                                </div>
                            ))}
                        </Card.Body></Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MyProfile;
