import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, Button, Spinner,
  Badge, Form
} from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import "./BookingForm.css";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [bookedClasses, setBookedClasses] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [showPayButton, setShowPayButton] = useState(false);
const [classId,setClassId]=useState(null)
  const next7Days = Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx);
    return {
      label: date.toLocaleDateString("en-US", { weekday: "long" }),
      value: date.toDateString(),
      short: date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase() // sun, mon...
    };
  });

  // Fetch teacher, student and classes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [teacherRes, classRes] = await Promise.all([
          fetch(`http://localhost:5000/api/teachers/${id}`),
          fetch(`http://localhost:5000/api/classes`)
        ]);
        const teacherData = await teacherRes.json();
        const classData = await classRes.json();

        setTeacher(teacherData);
        setBookedClasses(classData);

        if (user?.email && !studentId) {
          const studentRes = await fetch(`http://localhost:5000/api/student_by_email?email=${user.email}`);
          const studentData = await studentRes.json();
          setStudentId(studentData._id);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user,studentId]);

  const handleDayChange = (e) => {
    const selectedDateStr = e.target.value;
    setSelectedDay(selectedDateStr);
    setSelectedTime("");

    const selectedObj = next7Days.find(day => day.value === selectedDateStr);
    const dayShort = selectedObj.short;

    const bookedForDay = bookedClasses.filter(cls =>
      new Date(cls.classDate).toDateString() === new Date(selectedDateStr).toDateString()
    );

    const unavailableTimes = new Set();
    bookedForDay.forEach(cls => {
      if (cls.teacherId === id || cls.studentId === studentId) {
        unavailableTimes.add(cls.time);
      }
    });

    const filteredSlots = teacher?.slots?.filter(slot =>
      slot.day === dayShort &&
      (!slot.isBooked || slot.isBooked === false) &&
      !unavailableTimes.has(slot.time)
    );

    const times = filteredSlots?.map(slot => slot.time) || [];
    setAvailableTimeSlots(times);
  };

  const handleBooking = async () => {
  if (!selectedDay || !selectedTime) return;

  try {
    // 1. Book the class
    const classRes = await fetch("http://localhost:5000/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId: id,
        studentId,
        classDate: selectedDay,
        time: selectedTime,
        status: "upcoming",
        paymentStatus: "unpaid",
        amount:teacher.chargePerHour,
        transactionId:null,
        classLink:""
      })
    });
    const classData=await classRes.json()
    // console.log("booking form",classData)
    setClassId(classData?.insertedId)
    // 2. Mark slot as booked in DB
    const updateRes = await fetch(`http://localhost:5000/api/teachers/update-slot/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day: next7Days.find(day => day.value === selectedDay).short,
        time: selectedTime
      })
    });
    // console.log(updateRes)
    // ✅ 3. Update local teacher.slots immediately
    if (classRes.ok && updateRes.ok) {
      setTeacher(prev => ({
        ...prev,
        slots: prev?.slots?.map(slot =>
          slot.day === next7Days.find(day => day.value === selectedDay).short &&
          slot.time === selectedTime
            ? { ...slot, isBooked: true }
            : slot
        )
      }));
      setShowPayButton(true);
      setAvailableTimeSlots(prev => prev.filter(t => t !== selectedTime)); // optional: remove from time dropdown
    } else {
      alert("Booking failed. Try again.");
    }
  } catch (err) {
    console.error("Booking error:", err);
  }
};

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!teacher) {
    return (
      <Container className="text-center mt-5">
        <h4>Teacher not found</h4>
      </Container>
    );
  }

  const {
    firstName, lastName, email, educationalQualification, categories,
    documents, profilePic, chargePerHour, dob, rating
  } = teacher;
  const handleNavigate=()=>{
    navigate(`/payment/${classId}`)
  }
  return (
    <Container className="booking-form my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Link to="/explore-tutors">
            <i className="fas fa-arrow-left mb-3 fs-4"></i>
          </Link>
          <Card className="p-4 shadow-lg">
            <Row>
              <Col md={4} className="text-center">
                <img src={profilePic} alt="Profile" className="rounded-circle img-fluid profile-pic" />
                <h5 className="mt-3">{firstName} {lastName}</h5>
                <p className="text-muted">{educationalQualification}</p>
                <p><strong>Rate:</strong> ${chargePerHour}/hr</p>
                <p><strong>Rating:</strong> {rating} ⭐</p>
              </Col>
              <Col md={8}>
                <h5>About the Teacher</h5>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Date of Birth:</strong> {new Date(dob).toLocaleDateString()}</p>
                <p><strong>Categories:</strong></p>
                {categories?.map((cat, idx) => (
                  <Badge key={idx} bg="primary" className="me-2">{cat}</Badge>
                ))}

                <div className="mt-3">
                  <a href={documents} target="_blank" rel="noopener noreferrer">
                    📄 View Documents
                  </a>
                </div>

                <div className="mt-4">
                  <h6>Select Day & Time</h6>
                  <Form.Select
                    className="mb-3"
                    onChange={handleDayChange}
                    value={selectedDay}
                  >
                    <option value="">Select Day</option>
                    {next7Days?.map((day, idx) => (
                      <option key={idx} value={day.value}>{day.label}</option>
                    ))}
                  </Form.Select>

                  {selectedDay && (
                    <Form.Select
                      className="mb-3"
                      onChange={(e) => setSelectedTime(e.target.value)}
                      value={selectedTime}
                    >
                      <option value="">Select Time</option>
                      {availableTimeSlots.length === 0 ? (
                        <option disabled>No available slots</option>
                      ) : (
                        availableTimeSlots?.map((time, idx) => (
                          <option key={idx} value={time}>{time}</option>
                        ))
                      )}
                    </Form.Select>
                  )}

                  <Button
                    variant="primary"
                    disabled={!selectedDay || !selectedTime}
                    onClick={handleBooking}
                  >
                    Confirm Slot
                  </Button>

                  {showPayButton && (
                    <div className="text-end mt-4">
                      <Button variant="success" onClick={handleNavigate}>
                        💳 Pay Now
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm;
