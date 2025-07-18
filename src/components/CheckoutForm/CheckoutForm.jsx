import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Spinner } from "react-bootstrap";

const CheckoutForm = ({ classData,amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
// console.log(amount)
 const handlePayment = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) {
    alert("Stripe not loaded yet.");
    return;
  }

  const cardElement = elements.getElement(CardElement);

  if (!cardElement) {
    alert("Card input not ready. Please try again in a moment.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseInt(amount) * 100 }), // cents
    });

    const { clientSecret } = await res.json();

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else if (paymentResult.paymentIntent.status === "succeeded") {
      await fetch(`http://localhost:5000/api/classes/update-payment-status/${classData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "paid",
          transactionId: paymentResult.paymentIntent.id,
        }),
      });

      await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: classData.teacherId,
          studentId: classData.studentId,
          classId: classData._id,
          amount: parseFloat(amount),
          createdAt: new Date().toISOString(),
        }),
      });

      alert("Payment successful!");
    }
  } catch (err) {
    console.error("Payment failed:", err);
    alert("Payment failed.");
  } finally {
    setLoading(false);
  }
};


  
    return loading ?

      <div>Loading...</div>
      :
      <form onSubmit={handlePayment}>
        <CardElement />
        <Button type="submit" variant="primary" disabled={!stripe || loading || classData
          ?.paymentStatus === 'paid'} className="mt-3 w-100">
          {loading ? <Spinner animation="border" size="sm" /> : "Pay Now"}
        </Button>
      </form>

  

};

export default CheckoutForm;
