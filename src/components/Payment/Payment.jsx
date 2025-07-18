import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PaymentForm from "../PaymentForm/PaymentForm";
// Custom component where Stripe CardElement is used

const stripePromise = loadStripe( import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Replace with your Stripe public key

const Payment = () => {
 
  
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount,setAmount]=useState(0);
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
  useEffect(()=>{
    const fetchTeacherData=async()=>{
      const response=await fetch(`http://localhost:5000/api/teachers/${classData?.teacherId}`);
      const data=await response.json();
      setAmount(parseInt(data.chargePerHour));
    }
    fetchTeacherData();
  },[classData])
  
  if (loading || !classData) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading class info...</p>
      </Container>
    );
  }
  else if(classData.paymentStatus==='paid'){
    return(
      <h1 className="text-center my-5">Already Paid</h1>
    )
  }
  else{
    return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow">
            <h4 className="mb-4 text-center">Complete Payment</h4>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Teacher ID:</strong> {classData.teacherId}</p>
            <p><strong>Student ID:</strong> {classData.studentId}</p>
            <p><strong>Class Date:</strong> {classData.classDate}</p>
            <p><strong>Time:</strong> {classData.time}</p>

            <Elements stripe={stripePromise}>
                <PaymentForm amount={amount} classData={classData}/>
            </Elements>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  }
  
};

export default Payment;
