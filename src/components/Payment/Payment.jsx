import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
// Custom component where Stripe CardElement is used

const stripePromise = loadStripe( import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Replace with your Stripe public key

const Payment = () => {
 
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  
const {id}=useParams();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/classes/${id}`);
        const data = await res.json();
        setClassData(data);
        
      } catch (err) {
        console.error("Error fetching class data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassData();
    } else {
      alert("No class ID found");
    
    }
  }, [id]);

  if (loading || !classData) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading class info...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow">
            <h4 className="mb-4 text-center">Complete Payment</h4>
            <p><strong>Amount:</strong> ${classData.amount}</p>
            <p><strong>Teacher ID:</strong> {classData.teacherId}</p>
            <p><strong>Student ID:</strong> {classData.studentId}</p>
            <p><strong>Class Date:</strong> {classData.classDate}</p>
            <p><strong>Time:</strong> {classData.time}</p>

            <Elements stripe={stripePromise}>
              <CheckoutForm classData={classData} />
            </Elements>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
