import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";

import styles from "../styles/SignUp.module.css";

import arrowForward from "../images/arrowOnly.svg";
import padLock from "../images/checkoutPadLock.svg";
import badge from "../images/badgeWithCheck.svg";

export default function CheckoutScreen({ clientData, setCheckoutPage }) {
  const stripePromise = loadStripe(
    "pk_test_51MCJIYE9iLxZZhRi4gIxJXtFM0UJ6aCUYosbxOtKn0eQs2fJNO62QHBR8XoQyQTlqPZBhPzygF2NKKM5jEgSMg6C00HNnprEui"
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitted')
  };
  return (
    <div className={styles.container}>
      <section className={styles.signUpActions}>
        <div className={styles.iconSection}></div>
        <h1 className={`${styles.greeting} ${styles.shadow}`}>
          Hi{" "}
          {clientData.name &&
            (clientData.name ? clientData.name : "it feels good to")}
          !
        </h1>
        <div className={`${styles.payForwardContainer} ${styles.shadow}`}>
          <span id="txt-type">Pay Forward</span>
        </div>
        <div className={styles.formAction}>
          <div className={styles.inputSection}>
            <button
              type="button"
              onClick={() => setCheckoutPage(false)}
              className={styles.backBtn}
            >
              <img
                src={arrowForward}
                className={styles.backArrowBtn}
                alt="go to previous form step"
              />
            </button>
            <div className={styles.paymentCard}>
              <img src={padLock} className={styles.padLock} alt="" />
              <span className={styles.secureText}>100% Secure</span>
              <div className={styles.bluePrice}>
                <img src={badge} alt="" />
                {`${clientData.subscriptionAmount}`}
              </div>
              <div className={styles.cardElemContainer}>
                <Elements stripe={stripePromise}>
                  <CheckoutForm handleSubmit={handleSubmit} />
                </Elements>
              </div>
              <span className={styles.stripeName}>Powered by stripe</span>
            </div>
            <button type="button" className={styles.forwardBtnHidden} />
          </div>
        </div>
      </section>
    </div>
  );
}
