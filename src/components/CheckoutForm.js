import React, { useRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./Button";
import "../styles/CardElement.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CheckoutForm({ clientData, handleSuccess, setLoading }) {
  const stripe = useStripe();
  const elements = useElements();
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientData.paymentIntent.clientSecret) {
      return;
    }

    const result = await stripe.confirmCardPayment(
      clientData.paymentIntent.clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: clientData.name,
            email: clientData.email,
          },
        },
      }
    );

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        handleSuccess(result);
      }
    }
  };

  return (
    <form ref={formRef}>
      <label className="cardElementContainer">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </label>
      <Button
        action={handleSubmit}
        text={"Seal the deal"}
        className={"payButton"}
      />
    </form>
  );
}

export default CheckoutForm;
