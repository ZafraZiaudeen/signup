import React, { useRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import "../styles/CardElement.css";
import { updateErrorMessage } from "../actions/common";
import Alert from "./Alert";
import CouponInput from "./CouponInput";

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

function CheckoutForm({ clientData, handleSuccess, setLoading, couponComponent }) {
  const stripe = useStripe();
  const elements = useElements();
  const formRef = useRef();
  const dispatch = useDispatch();
  const trigger = useSelector((state) => state.common)?.errorMessage?.trigger

  const CouponComponent = couponComponent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(clientData.paymentIntent.clientSecret);

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
      if (result.error.message.includes("Your card number is incomplete")) {
        return dispatch(
          updateErrorMessage({
            message:
              "Your card number info? 🎩✨ We need it to continue the journey! 🚀🌟",
            negative: true,
            animated: true,
            subText: "",
            trigger: !trigger
          })
        );
      }
      dispatch(
        updateErrorMessage({
          message: result.error.message,
          negative: true,
          animated: true,
          subText: "",
          trigger: !trigger
        })
      );
    } else {
      if (result.paymentIntent.status === "succeeded") {
        handleSuccess(result);
      }
    }
  };

  // console.log(CouponComponent, "CouponComponent")

  return (
    <form ref={formRef}>
      <CouponInput />
      <Alert gifBell={true} />

      <label className="cardElementContainer">
        <div className="gradientWrapper">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </label>
      <CouponComponent />
      <Button
        action={handleSubmit}
        text={"Yes! Lets do this"}
        className={"payButton"}
      />
    </form>
  );
}

export default CheckoutForm;
