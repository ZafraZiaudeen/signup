import React, { useEffect, useState } from "react";
import config from "../config/config";
import user from "../api/user";
import extension from "../api/extension";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useDispatch, useSelector } from "react-redux";

import styles from "../styles/SignUp.module.css";
import newStyles from "../styles/PayForward.module.css";

import arrowForward from "../images/arrowOnly.svg";
import padLock from "../images/checkoutPadLock.svg";
import badgeBlue from "../images/badgeBlue.svg";
import coupon from "../images/coupon.svg";
import { setClientData, setCouponData, toggleCoupon } from "../actions/common";

import paymentsApi from "../api/payments";
import { persistor } from "../redux/configureStore";

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

  const clientData = useSelector((state) => state.common).clientData;
  const sessionCoupon = sessionStorage.getItem("coupon");
  const fromSession = useSelector((state) => state.common).fromSession;
  const isTrialActive = useSelector((state) => state.common?.settings)?.trial;
  const selectedSubscription = useSelector(
    (state) => state.common
  )?.selectedSubscription;

  const handleCouponButton = () => {
    dispatch(toggleCoupon());
  };

  const handleSuccess = async (data) => {
    setComplete(true);
    const localUser = localStorage.getItem("user");
    let parsedUser;

    if (localUser) parsedUser = JSON.parse(localUser);

    setTimeout(async () => {
      let result = await user.updateStripeCustomer({
        paymentIntent: clientData.paymentIntent,
        email: clientData.email || parsedUser.email,
        stripeCustomerId: clientData.paymentIntent.customerId,
        subscriptionAmount: clientData.subscriptionAmount,
        payPeriod: clientData.payPeriod,
        paymentIntentId: data.paymentIntent.id,
        subscriptionId: clientData.paymentIntent.subscriptionId,
      });

      localStorage.removeItem("signUpForm");
      localStorage.removeItem("step1");
      localStorage.removeItem("step2");
      localStorage.removeItem("step3");
      persistor.purge();
      extension.openLoginPage(data.paymentIntent.id);
    }, 1300);
  };

  useEffect(() => {
    // if (!couponData?.id) return;

    (async () => {
      const newPaymentIntent = await paymentsApi.createSubscription({
        customerId: clientData?.paymentIntent?.customerId,
        price: config?.devMode
          ? config.devPrice
          : clientData.subscriptionAmount,
        planId: config?.devMode ? config.devPriceId : clientData.planId,
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
    })();
  }, [couponData]);

  const CouponApplied = () => {
    return (
      <div className={newStyles.sessionCouponContainer}>
        <img src={coupon} className={newStyles.sessionCouponIcon} />
        <span className={newStyles.sessionCouponTitle}>
          30 Days Trial Coupon Applied
        </span>
        <span className={newStyles.sessionCouponSubtitle}>
          - $0 charge / cancel anytime
        </span>
      </div>
    );
  };

  const CouponComponent = () => {
    if (sessionCoupon) return <></>;
    if (false)
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
                  {!(fromSession && isTrialActive) && (
                    <span className={styles.previousPrice}>$19</span>
                  )}
                  <span
                    className={
                      fromSession && isTrialActive
                        ? styles.previousPrice
                        : styles.subscriptionAmount
                    }
                  >
                    ${`${selectedSubscription[0]?.price}`}
                  </span>
                  {fromSession && isTrialActive && (
                    <span className={styles.subscriptionAmount}>$0</span>
                  )}
                </div>{" "}
                {fromSession && isTrialActive && <CouponApplied />}
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
