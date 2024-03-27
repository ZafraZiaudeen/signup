import React, { useEffect, useState } from "react";
import config from "../config/config";
import user from "../api/user";
import extension from "../api/extension";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useDispatch, useSelector } from "react-redux";

import Lottie from "react-lottie";
import styles from "../styles/SignUp.module.css";
import newStyles from "../styles/PayForward.module.css";
import anims from "../styles/animations.module.css";

import arrowForward from "../images/arrowOnly.svg";
import padLock from "../images/checkoutPadLock.svg";
import badge from "../images/badgeBlue.svg";
import badgeBlue from "../images/badgeBlue.svg"
import coupon from "../images/coupon.svg";
import loadingAnimation from "../images/loading.json";
import { setClientData, toggleCoupon } from "../actions/common";
import axios from "axios";
import paymentsApi from "../api/payments";

export default function CheckoutScreen({
  setCheckoutPage,
  loading,
  setLoading,
}) {
  const [data, setData] = useState({});
  const [complete, setComplete] = useState(false);
  const stripePromise = loadStripe(config.stripeSecret);
  const dispatch = useDispatch();
  const couponData = useSelector((state) => state.common)?.couponData;
  const [isTrialActive, setIsTrialActive] = useState(false);
  const clientData = useSelector((state) => state.common).clientData;

  const handleCouponButton = () => {
    dispatch(toggleCoupon());
  };

  const handleSuccess = async (data) => {
    setComplete(true);
    setTimeout(async () => {
      let result = await user.updateStripeCustomer({
        paymentIntent: clientData.paymentIntent,
        email: clientData.email,
        stripeCustomerId: clientData.paymentIntent.customerId,
        subscriptionAmount: clientData.subscriptionAmount,
        payPeriod: clientData.payPeriod,
        paymentIntentId: data.paymentIntent.id,
      });

      localStorage.removeItem("signUpForm");
      localStorage.removeItem("step1");
      localStorage.removeItem("step2");
      localStorage.removeItem("step3");
      extension.openLoginPage(data.paymentIntent.id);
    }, 1300);
  };

  useEffect(() => {
    console.log(clientData);
  }, [clientData, data]);

  useEffect(() => {
    (async () => {
      const settingsRes = await axios.get(
        `${config.serverUrl}/api/v1/settings`
      );
      if (settingsRes?.data?.trial) {
        setIsTrialActive(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!couponData?.id) return;

    (async () => {
      const newPaymentIntent = await paymentsApi.createSubscription({
        customerId: clientData?.paymentIntent?.customerId,
        price: clientData.subscriptionAmount,
        planId: clientData.planId,
        coupon: couponData?.id,
      });

      dispatch(
        setClientData({
          ...clientData,
          paymentIntent: {
            ...clientData.paymentIntent,
            subscriptionId: newPaymentIntent?.data?.subscription?.id,
            clientSecret: newPaymentIntent?.data?.client_secret,
            paymentIntentId: newPaymentIntent?.data?.paymentIntentId,
          },
        })
      );
      console.log("newPaymentIntent", newPaymentIntent);
    })();
  }, [couponData]);

  const CouponComponent = () => {
    if (isTrialActive)
      return (
        <div className={newStyles.couponButtonContainer}>
          <img src={coupon} className={newStyles.couponIcon} />
          <button
            className={newStyles.couponButton}
            onClick={handleCouponButton}
          >
            {couponData
              ? `COUPON APPLIED ${couponData?.coupon?.percent_off}% OFF`
              : "Have Promo code click to enter?"}
          </button>
        </div>
      );
    return <></>;
  };

  return (
    <div className={styles.container}>
      <section className={styles.signUpActions}>
        <div style={{ margin: "60px 0" }}>
          <div className={styles.iconSection}></div>
          <span className={`${styles.checkout_greeting} ${styles.shadow}`}>
            Time to shine ✨
          </span>
          <div className={`${styles.payForwardContainer} ${styles.shadow}`}>
            <h2 id="txt-type" className={styles.payForwardText}>
              {clientData.name}
            </h2>
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
                    <div className={newStyles.prgressbarContainer}>
                      <div
                        className={newStyles.progressbar}
                        style={{ width: !complete ? "40%" : "100%" }}
                      />
                    </div>
                    {/* <Lottie
                    options={{ animationData: loadingAnimation }}
                    width={48}
                    height={48}
                    className={anims.fadeIn}
                  /> */}
                  </div>
                )}
                <img src={padLock} className={styles.padLock} alt="" />
                <span className={styles.secureText}>100% Secure</span>
                <div className={styles.bluePrice}>
                  <img src={badgeBlue} alt="" />
                  <span className={styles.previousPrice}>$19</span>
                  <span className={styles.subscriptionAmount}>
                    ${`${clientData.subscriptionAmount}`}
                  </span>
                </div>
                <div className={styles.cardElemContainer}>
                  {/* {isTrialActive && (
                    <div className={newStyles.couponButtonContainer}>
                      <img src={coupon} className={newStyles.couponIcon} />
                      <button
                        className={newStyles.couponButton}
                        onClick={handleCouponButton}
                      >
                        {couponData
                          ? `COUPON APPLIED ${couponData?.coupon?.percent_off}% OFF`
                          : "HAVE A COUPON CODE?"}
                      </button>
                    </div>
                  )} */}
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      couponComponent={CouponComponent}
                      handleSuccess={handleSuccess}
                      clientData={clientData}
                      setLoading={setLoading}
                    />
                  </Elements>
                </div>
              </div>
              <button type="button" className={`${styles.forwardBtnHidden}`} />
            </div>
          </div>
          <span className={styles.stripeName}>
            Secured by Stripe /{" "}
            <a href="https://stripe.com/en-gb-us/legal/consumer">
              Term of Service
            </a>
          </span>
        </div>
      </section>
    </div>
  );
}
