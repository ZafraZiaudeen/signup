import React, { useRef } from "react";
import { CardElement } from "@stripe/react-stripe-js";
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

function CheckoutForm({ handleSubmit }) {
  const formRef = useRef();
  const handleButtonPress = (e) => {
    e.preventDefault();
    formRef.submit();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <label className="cardElementContainer">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </label>
      <Button
        action={handleButtonPress}
        text={"Pay Forward"}
        className={"payButton"}
      />
    </form>
  );
}

export default CheckoutForm;
