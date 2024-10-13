import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import CouponInput from "../components/CouponInput";
import { createGAEvent } from "../utils/utils";

import styles from "../styles/SignUp.module.css";
import newStyles from "../styles/PayForward.module.css";
import anims from "../styles/animations.module.css";
import star from "../images/ratingStar.svg";
import priceBadge from "../images/badgeBlue.svg";
import lisa from "../images/Lisa.png";

import axios from "axios";
import Pricing from "../api/pricingPlans";
import Loader from "../components/Loader";
import arrowForward from "../images/arrowOnly.svg";
import Lottie from "react-lottie";
import loadingAnimation from "../images/loading.json";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSubscription } from "../actions/common";
import config from "../config/config";
import { setSettings } from "../actions/common";
import userApi from "../api/user";

export default function PayForwardScreen({
  name,
  setPayPeriod,
  setSubAmounts,
  subscriptionAmount,
  setSubscriptionAmount,
  payPeriod,
  setPlanId,
  getText,
  handleSubmitSub,
  loading,
  setLoading,
  setStep,
  userCreated,
}) {
  const handleGoBack = () => {
    setStep("4");
  };

  const [subscriptions, setSubscriptions] = useState({
    monthly: [],
    yearly: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [planText, setPlanText] = useState(
    "Join our family and pay forward for one person"
  );
  const [time, setTime] = useState(1000 * 60 * 30);
  const sessionCoupon = sessionStorage.getItem("coupon");
  const couponData = useSelector((state) => state.common)?.couponData;
  const percentage = couponData?.coupon?.percent_off || 0 / 100;
  const clientData = useSelector((state) => state.common)?.clientData;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedSubscription(subscriptions[payPeriod]));
    if (subscriptions?.monthly?.length > 0) {
      setPlanId(subscriptions[payPeriod][selectedIndex]?.priceId);
      return setSubscriptionAmount(
        subscriptions[payPeriod][selectedIndex]?.price
      );
    }
    setSubscriptionAmount(47.88);
  }, [payPeriod, subscriptions]);

  useEffect(() => {
    let signUpForm = localStorage.getItem("signUpForm");
    if (signUpForm) {
      let parsedForm = JSON.parse(signUpForm);
      if (parsedForm.subscriptionAmount) {
        let _payPeriod = parsedForm.payPeriod;

        setPayPeriod(_payPeriod);
        setSubAmounts(subscriptions[_payPeriod]);
        setSubscriptionAmount(parsedForm.subscriptionAmount);
        if (parsedForm.planId) setPlanId(parsedForm.planId);
      }
    }
  }, [subscriptions]);

  const handleSubChange = (index) => {
    setSubscriptionAmount(subscriptions[payPeriod][index].price);
    setSelectedIndex(index);
    setPlanText(subscriptions[payPeriod][index].text);
    setPlanId(subscriptions[payPeriod][index].priceId);
  };

  const getTriangleLeft = () => {
    return selectedIndex === 0 ? "17%" : selectedIndex === 1 ? "50%" : "80%";
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60000);
    let seconds = ((time % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const response = await Pricing.getAllPlans();
      setSubscriptions(response.data[0].plans);
      setPlanId(response.data[0].plans.monthly[0].priceId);
      setLoading(false);
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    let time = localStorage.getItem("timeoutTime");
    if (!time || time === "undefined" || time === "NaN") time = 1000 * 60 * 30;
    setTime(parseInt(time));
  }, []);

  useEffect(() => {
    let timer = setInterval(() => {
      if (time <= 0) return clearInterval(timer);
      setTime((prevTime) => {
        if (prevTime <= 0) return 0;
        return prevTime - 1000;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const localTime = localStorage.getItem("timeoutTime");
    if (localTime && localTime !== "undefined" && localTime !== "NaN") {
      if (time === 1000 * 60 * 30) return;
      localStorage.setItem("timeoutTime", time);
    }
  }, [time]);

  useEffect(() => {
    (async () => {
      const settingsRes = await axios.get(
        `${config.serverUrl}/api/v1/settings`
      );

      dispatch(setSettings(settingsRes.data));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if(sessionStorage.getItem("subscriptionRenew")) return;
      const saved = await userApi.saveEmail({
        name: clientData.name,
        email: clientData.email,
      });
    })();
  }, [clientData]);

  return (
    <div className={styles.welcome}>
      {!userCreated && (
        <button
          type="button"
          onClick={handleGoBack}
          className={newStyles.backBtn}
        >
          <img
            src={arrowForward}
            className={newStyles.backArrowBtn}
            alt="go to previous form step"
          />
        </button>
      )}

      <div className={`${styles.mainSection} ${styles.payFwdMainSection}`}>
        <p className={styles.payfwdTitle}>Self love feels right</p>
        <h2 className={styles.payfwdName}>{name}</h2>
        <div className={`${styles.innerContainer} ${newStyles.relativeDiv}`}>
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
          <div className={styles.promoSection}>
            <div className={styles.reviewContainer}>
              <img src={lisa} alt="" />
              <div className={styles.ratingCount}>
                5
                <img src={star} alt="icon of rating star" />
              </div>
            </div>
            <div className={styles.reviewText}>
              Best life decision I’ve made in a long time!{" "}
              <span className={styles.reviewerName}>Lisa Review</span>
            </div>
          </div>
          <div className={styles.monthlyOrYearlyTab}>
            <div className={styles.monthlyOrYearly}>
              <button
                type="button"
                onClick={() => {
                  setPayPeriod("monthly");
                  createGAEvent(
                    "Button",
                    "button_click",
                    "Switched to monthly"
                  );
                }}
                className={payPeriod === "monthly" ? styles.activePeriod : ""}
              >
                {sessionCoupon ? "TRY" : "COMMIT"} MONTHLY
                <div
                  className={
                    payPeriod === "monthly"
                      ? `${styles.PeriodUnderline} ${styles.activePeriodUnderline}`
                      : styles.PeriodUnderline
                  }
                ></div>
                {/* <span className={styles.youSave}>Save 18%</span> */}
                {/* <span
                  className={
                    payPeriod === "monthly"
                      ? `${styles.commit} ${styles.active}`
                      : styles.commit
                  }
                >
                  Commit Monthly
                </span> */}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPayPeriod("yearly");
                  createGAEvent("Button", "button_click", "Switched to yearly");
                }}
                className={
                  payPeriod === "yearly"
                    ? `${styles.activePeriod} ${styles.mostPopularContainer}`
                    : styles.mostPopularContainer
                }
              >
                <div className={styles.mostPopular}>Most Popular</div>
                <div className={styles.buttonText}>
                  {sessionCoupon ? "TRY" : "COMMIT"} ANNUALLY{" "}
                  <span className={styles.youSave}>Save 18%</span>
                </div>
                <div
                  className={
                    payPeriod === "yearly"
                      ? `${styles.PeriodUnderline} ${styles.activePeriodUnderline}`
                      : styles.PeriodUnderline
                  }
                ></div>
              </button>
            </div>
            <div className={styles.pricesWrapper}>
              {payPeriod === "monthly" && (
                // <div className={styles.monthlyPrices}>
                //   {subscriptions?.monthly?.map((subscription, index) => {
                //     return (
                //       <div key={index}>
                //         <input
                //           type="radio"
                //           name="price"
                //           value={subscription.price}
                //           id={subscription.price}
                //           onChange={() => handleSubChange(index)}
                //           checked={subscriptionAmount === subscription.price}
                //         />
                //         <label
                //           htmlFor={subscription.price}
                //           className={styles.radioBtnGroup}
                //           style={{
                //             backgroundColor:
                //               subscriptionAmount === subscription.price
                //                 ? "#0089ff"
                //                 : "",
                //             border:
                //               subscriptionAmount === subscription.price
                //                 ? "1px solid #ffffff"
                //                 : "",
                //             color:
                //               subscriptionAmount === subscription.price
                //                 ? "#ffffff"
                //                 : "",
                //           }}
                //         >
                //           <img src={priceBadge} alt="badge" />
                //           <span className={styles.previousPrice}>
                //             ${subscription.previousPrice}
                //           </span>
                //           ${subscription.price}
                //         </label>
                //       </div>
                //     );
                //   })}
                // </div>
                <div className={styles.monthlyPrices}>
                  {/* <span className={styles.mostPopular}>Most Popular</span> */}
                  <div className={styles.priceButton}>
                    <input
                      type="radio"
                      name="price"
                      value={subscriptions?.monthly[0]?.price}
                      id={subscriptions?.monthly[0]?.price}
                      onChange={() => handleSubChange(0)}
                      // checked={
                      //   subscriptionAmount === subscriptions?.monthly[0]?.price
                      // }
                      checked={true}
                    />
                    <label
                      htmlFor={subscriptions?.monthly[0]?.price}
                      className={styles.radioBtnGroup}
                      style={{
                        backgroundColor:
                          subscriptionAmount ===
                          subscriptions?.monthly[0]?.price
                            ? "#F2F9FF"
                            : "",
                        border:
                          subscriptionAmount === subscriptions.monthly[0]?.price
                            ? "1px solid #C7E1FF"
                            : "",
                        color:
                          subscriptionAmount === subscriptions.monthly[0]?.price
                            ? "#0389FF"
                            : "",
                      }}
                    >
                      <img src={priceBadge} alt="badge" />
                      <span className={styles.previousPrice}>
                        {sessionCoupon
                          ? `$${subscriptions.monthly[0]?.price}`
                          : `$${subscriptions.monthly[0]?.previousPrice}`}
                      </span>
                      {sessionCoupon
                        ? `$${
                            subscriptions.monthly[0]?.price -
                            (subscriptions.monthly[0]?.price * percentage) / 100
                          }`
                        : `$${subscriptions.monthly[0]?.price}`}
                    </label>
                    <span className={newStyles.countdown}>
                      Deal ends in {formatTime(time)}
                    </span>
                  </div>
                </div>
              )}
              {payPeriod === "yearly" && (
                // <div className={styles.monthlyPrices}>
                //   {subscriptions?.yearly?.map((subscription, index) => {
                //     return (
                //       <div key={index}>
                //         <input
                //           type="radio"
                //           name="price"
                //           value={subscription.price}
                //           id={subscription.price}
                //           onChange={() => handleSubChange(index)}
                //           checked={subscriptionAmount === subscription.price}
                //         />
                //         <label
                //           htmlFor={subscription.price}
                //           className={styles.radioBtnGroup}
                //           style={{
                //             backgroundColor:
                //               subscriptionAmount === subscription.price
                //                 ? "#0089ff"
                //                 : "",
                //             border:
                //               subscriptionAmount === subscription.price
                //                 ? "1px solid #ffffff"
                //                 : "",
                //             color:
                //               subscriptionAmount === subscription.price
                //                 ? "#ffffff"
                //                 : "",
                //           }}
                //         >
                //           <img src={priceBadge} alt="badge" />
                //           <span className={styles.previousPrice}>
                //             ${subscription.previousPrice}
                //           </span>
                //           ${subscription.price}
                //         </label>
                //       </div>
                //     );
                //   })}
                // </div>
                <div className={styles.monthlyPrices}>
                  <div className={styles.priceButton}>
                    <input
                      type="radio"
                      name="price"
                      value={subscriptions?.yearly[0]?.price}
                      id={subscriptions?.yearly[0]?.price}
                      onChange={() => handleSubChange(0)}
                      // checked={
                      //   subscriptionAmount === subscriptions?.yearly[0]?.price
                      // }
                      checked={true}
                    />
                    <label
                      htmlFor={subscriptions?.yearly[0]?.price}
                      className={styles.radioBtnGroup}
                      style={{
                        backgroundColor:
                          subscriptionAmount === subscriptions?.yearly[0]?.price
                            ? "#F2F9FF"
                            : "",
                        border:
                          subscriptionAmount === subscriptions?.yearly[0]?.price
                            ? "1px solid #C7E1FF"
                            : "",
                        color:
                          subscriptionAmount === subscriptions?.yearly[0]?.price
                            ? "#0389FF"
                            : "",
                      }}
                    >
                      <img src={priceBadge} alt="badge" />
                      <span className={styles.previousPrice}>
                        {sessionCoupon
                          ? `$${subscriptions.yearly[0]?.price}`
                          : `$${subscriptions.yearly[0]?.previousPrice}`}
                      </span>
                      {sessionCoupon
                        ? `$${
                            subscriptions.yearly[0]?.price -
                            (subscriptions.yearly[0]?.price * percentage) / 100
                          }`
                        : `$${subscriptions.yearly[0]?.price}`}
                    </label>
                    <span className={newStyles.countdown}>
                      Deal ends in {formatTime(time)}
                    </span>
                  </div>
                </div>
              )}
              {/* <div className={styles.packageText}>
                <div
                  className={styles.triangle}
                  style={{ left: getTriangleLeft() }}
                ></div>
                {planText}
              </div> */}
            </div>
            <button
              type="submit"
              onClick={(e) => handleSubmitSub(e)}
              className={styles.buttonWithLoader}
              disabled={subscriptionAmount === "" || loading}
            >
              <span>{loading ? <Loader /> : "LET'S GO!"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
