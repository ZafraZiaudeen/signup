import React, { useRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./Button";
import { useDispatch } from "react-redux";
import "../styles/CardElement.css";
import { updateErrorMessage } from "../actions/common";
import Alert from "./Alert";

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
  const dispatch = useDispatch();

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
      setLoading(false);
      dispatch(
        updateErrorMessage({
          message: result.error.message,
          negative: true,
        })
      );
    } else {
      if (result.paymentIntent.status === "succeeded") {
        handleSuccess(result);
      }
    }
  };

  return (
    <form ref={formRef}>
      <Alert gifBell={true} />
      <label className="cardElementContainer">
        <div className="gradientWrapper">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </label>
      <Button
        action={handleSubmit}
        text={"Yes! Lets do this"}
        className={"payButton"}
      />
    </form>
  );
}

export default CheckoutForm;
