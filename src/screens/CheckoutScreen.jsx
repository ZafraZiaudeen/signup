import React, { useEffect, useState } from "react";
import config from "../config/config";
import user from "../api/user";
import extension from "../api/extension";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import Lottie from "react-lottie";
import styles from "../styles/SignUp.module.css";
import newStyles from "../styles/PayForward.module.css";
import anims from "../styles/animations.module.css";

import arrowForward from "../images/arrowOnly.svg";
import padLock from "../images/checkoutPadLock.svg";
import badge from "../images/badgeWithCheck.svg";
import loadingAnimation from "../images/loading.json";

export default function CheckoutScreen({ clientData, setCheckoutPage, loading, setLoading }) {
  const [data, setData] = useState({});
  const stripePromise = loadStripe(config.stripeSecret);

  console.log(clientData);

  const handleSuccess = async (data) => {
    setLoading(false);
    let result = await user.updateStripeCustomer({
      email: clientData.email,
      stripeCustomerId: clientData.paymentIntent.customerId,
      subscriptionAmount: clientData.subscriptionAmount,
      payPeriod: clientData.payPeriod,
    });

    localStorage.removeItem("signUpForm");
    localStorage.removeItem("step1");
    localStorage.removeItem("step2");
    localStorage.removeItem("step3");
    extension.openLoginPage(data.paymentIntent.id);
  };

  useEffect(() => {
    console.log(clientData);
  }, [clientData, data]);

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
            <div className={`${styles.paymentCard} ${newStyles.relativeDiv}`}>
              {loading && (
                <div className={newStyles.lottieContainer}>
                  <Lottie
                    options={{ animationData: loadingAnimation }}
                    width={48}
                    height={48}
                    className={anims.fadeIn}
                  />
                </div>
              )}
              <img src={padLock} className={styles.padLock} alt="" />
              <span className={styles.secureText}>100% Secure</span>
              <div className={styles.bluePrice}>
                <img src={badge} alt="" />
                ${`${clientData.subscriptionAmount}`}
              </div>
              <div className={styles.cardElemContainer}>
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    handleSuccess={handleSuccess}
                    clientData={clientData}
                    setLoading={setLoading}
                  />
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
