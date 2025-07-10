import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Spinner } from "react-bootstrap";

const CheckoutForm = ({ classData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create PaymentIntent
      const res = await fetch("http://localhost:5000/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(classData.amount) * 100 }), // Stripe takes cents
      });
      const { clientSecret } = await res.json();

      // Confirm payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        alert(paymentResult.error.message);
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        // Update class payment status
        await fetch(`http://localhost:5000/api/classes/update-payment-status/${classData._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentStatus: "paid",
            transactionId: paymentResult.paymentIntent.id,
          }),
        });

        // Store transaction
        await fetch("http://localhost:5000/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherId: classData.teacherId,
            studentId: classData.studentId,
            classId: classData._id,
            amount: parseFloat(classData.amount),
            createdAt: new Date().toISOString(),
          }),
        });

        alert("Payment successful!");
        // window.location.href = "/"; // or navigate to any page
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <Button type="submit" variant="primary" disabled={!stripe || loading||classData
        ?.paymentStatus==='paid'} className="mt-3 w-100">
        {loading ? <Spinner animation="border" size="sm" /> : "Pay Now"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
