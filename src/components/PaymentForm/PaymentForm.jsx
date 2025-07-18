// This example shows you how to set up React Stripe.js and use Elements.
// Learn how to accept a payment using the official Stripe docs.
// https://stripe.com/docs/payments/accept-a-payment#web

import React, { useState } from 'react';

// import {CardElement, Elements, useElements, useStripe} from '';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from 'react-bootstrap';

const PaymentForm = ({ amount, classData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("")
    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {

            setError(error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            if (paymentMethod.id) {
                try {

                    await fetch(`http://localhost:5000/api/classes/update-payment-status/${classData._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            paymentStatus: "paid",
                            transactionId:paymentMethod.id,
                        }),
                    });

                    await fetch("http://localhost:5000/api/transactions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            teacherId: classData.teacherId,
                            studentId: classData.studentId,
                            classId: classData._id,
                            amount: parseInt(amount),
                            createdAt: new Date().toISOString(),
                        }),
                    });

                    alert("Payment successful!");

                } catch (err) {
                    console.error("Payment failed:", err);
                    alert("Payment failed.");
                } 
                finally{
                    window.location.reload();
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            <Button type="submit" disabled={!stripe} style={{ marginLeft: "30%" }}>
                Pay ${amount}
            </Button>
            <h5 style={{ color: 'red', textAlign: "center" }}>{error?.message}</h5>
        </form>
    );
};


export default PaymentForm;