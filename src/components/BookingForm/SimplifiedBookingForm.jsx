import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner, Alert } from "react-bootstrap";

const SimplifiedBookingForm = ({ teacher, studentEmail }) => {
  const navigate = useNavigate();
  const [bookedClasses, setBookedClasses] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Generate days from today to next 7 days
  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return days;
  };

  // Get available time slots based on selected day
  const getAvailableTimes = () => {
    if (!selectedDay || !teacher?.slots) return [];
    
    const dayOfWeek = new Date(selectedDay).toLocaleDateString('en-US', { 
      weekday: 'long' 
    }).toLowerCase().substring(0, 3); // Convert to short day (e.g., Monday -> mon)
    
    // Get teacher's slots for this day
    const teacherSlots = teacher.slots
      .filter(slot => slot.day === dayOfWeek)
      .map(slot => slot.time);
    
    // Get booked slots for this day
    const bookedSlots = bookedClasses
      .filter(cls => 
        new Date(cls.classDate).toDateString() === new Date(selectedDay).toDateString() &&
        (cls.teacherId === teacher._id || cls.studentId === studentId)
      )
      .map(cls => cls.time);

    // Return available slots that aren't booked
    return teacherSlots.filter(time => !bookedSlots.includes(time));
  };

  const handleBooking = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: teacher._id,
          studentId,
          classDate: selectedDay,
          time: selectedTime,
          status: "upcoming",
          paymentStatus: "unpaid",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/payment", { state: { classId: data._id } });
      } else {
        setError(data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Booking error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch booked classes
        const classesRes = await fetch("http://localhost:5000/api/classes");
        const classesData = await classesRes.json();
        setBookedClasses(classesData);

        // Get student ID
        if (studentEmail) {
          const studentRes = await fetch(
            `http://localhost:5000/api/student_by_email?email=${studentEmail}`
          );
          const studentData = await studentRes.json();
          if (studentData?._id) setStudentId(studentData._id);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentEmail]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" size="sm" />
        <p>Loading availability...</p>
      </div>
    );
  }

  const days = generateDays();
  const availableTimes = getAvailableTimes();

  return (
    <div className="booking-form">
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Select Day</Form.Label>
          <Form.Select
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              setSelectedTime("");
            }}
            disabled={loading}
          >
            <option value="">Choose a day</option>
            {days.map((day, index) => (
              <option key={index} value={day.value}>
                {day.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedDay && (
          <Form.Group className="mb-3">
            <Form.Label>Available Time Slots</Form.Label>
            <Form.Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDay || availableTimes.length === 0}
            >
              <option value="">Select a time</option>
              {availableTimes.length > 0 ? (
                availableTimes.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))
              ) : (
                <option disabled>No available slots</option>
              )}
            </Form.Select>
            {availableTimes.length === 0 && selectedDay && (
              <p className="text-danger mt-2">
                No available time slots for this day
              </p>
            )}
          </Form.Group>
        )}

        {selectedTime && (
          <div className="d-grid mt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleBooking}
              disabled={!selectedTime}
            >
              Confirm Booking
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default SimplifiedBookingForm;