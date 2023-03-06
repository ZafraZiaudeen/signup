import React, { useEffect, useState } from "react";
import styles from "../styles/SignUp.module.css";
import newStyles from "../styles/PayForward.module.css";
import anims from "../styles/animations.module.css";
import star from "../images/ratingStar.svg";
import priceBadge from "../images/pricebadge.svg";

import Pricing from "../api/pricingPlans";
import Loader from "../components/Loader";
import arrowForward from "../images/arrowOnly.svg";
import Lottie from "react-lottie";
import loadingAnimation from "../images/loading.json";

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
    setStep("3");
  };

  const [subscriptions, setSubscriptions] = useState({
    monthly: [],
    yearly: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [planText, setPlanText] = useState(
    "Join our family and pay forward for one person"
  );

  useEffect(() => {
    if (subscriptions?.monthly?.length > 0) {
      setPlanId(subscriptions[payPeriod][selectedIndex]?.priceId);
      return setSubscriptionAmount(
        subscriptions[payPeriod][selectedIndex]?.price
      );
    }
    setSubscriptionAmount(3.99);
  }, [payPeriod]);

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

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const response = await Pricing.getAllPlans();
      setSubscriptions(response.data[0].plans);
      setPlanId(response.data[0].plans.monthly[1].priceId);
      setLoading(false);
    };

    fetchPlans();
  }, []);

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
      <div className={styles.mainSection}>
        {name &&
          (name ? <p>I'm {name} it feels good to</p> : <p>It feels good to</p>)}
        <h2>Pay Forward</h2>
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
            <p>5.0</p>
            <div className={styles.starSection}>
              <img src={star} alt="icon of rating star" />
              <img src={star} alt="icon of rating star" />
              <img src={star} alt="icon of rating star" />
              <img src={star} alt="icon of rating star" />
              <img src={star} alt="icon of rating star" />
            </div>
          </div>
          <div className={styles.monthlyOrYearlyTab}>
            <div className={styles.monthlyOrYearly}>
              <button
                type="button"
                onClick={() => {
                  setPayPeriod("monthly");
                }}
                className={payPeriod === "monthly" ? styles.activePeriod : ""}
              >
                PAY MONTHLY
                <div
                  className={
                    payPeriod === "monthly"
                      ? `${styles.PeriodUnderline} ${styles.activePeriodUnderline}`
                      : styles.PeriodUnderline
                  }
                ></div>
                {/* <span className={styles.youSave}>Save 18%</span> */}
                <span
                  className={
                    payPeriod === "monthly"
                      ? `${styles.commit} ${styles.active}`
                      : styles.commit
                  }
                >
                  Commit Monthly
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPayPeriod("yearly");
                }}
                className={payPeriod === "yearly" ? styles.activePeriod : ""}
              >
                <div className={styles.buttonText}>
                  UP FRONT <span className={styles.youSave}>Save 18%</span>
                </div>
                <div
                  className={
                    payPeriod === "yearly"
                      ? `${styles.PeriodUnderline} ${styles.activePeriodUnderline}`
                      : styles.PeriodUnderline
                  }
                ></div>
                <span
                  className={
                    payPeriod === "yearly"
                      ? `${styles.commit} ${styles.active}`
                      : styles.commit
                  }
                >
                  Commit Annually
                </span>
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
                  <span className={styles.mostPopular}>Most Popular</span>
                  <div>
                    <input
                      type="radio"
                      name="price"
                      value={subscriptions?.monthly[1]?.price}
                      id={subscriptions?.monthly[1]?.price}
                      onChange={() => handleSubChange(1)}
                      checked={
                        subscriptionAmount === subscriptions?.monthly[1]?.price
                      }
                    />
                    <label
                      htmlFor={subscriptions?.monthly[1]?.price}
                      className={styles.radioBtnGroup}
                      style={{
                        backgroundColor:
                          subscriptionAmount ===
                          subscriptions?.monthly[1]?.price
                            ? "#0089ff"
                            : "",
                        border:
                          subscriptionAmount === subscriptions.monthly[1]?.price
                            ? "1px solid #ffffff"
                            : "",
                        color:
                          subscriptionAmount === subscriptions.monthly[1]?.price
                            ? "#ffffff"
                            : "",
                      }}
                    >
                      <img src={priceBadge} alt="badge" />
                      <span className={styles.previousPrice}>
                        ${subscriptions.monthly[1]?.previousPrice}
                      </span>
                      ${subscriptions.monthly[1]?.price}
                    </label>
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
                  <span className={styles.mostPopular}>Most Popular</span>
                  <div>
                    <input
                      type="radio"
                      name="price"
                      value={subscriptions?.yearly[1]?.price}
                      id={subscriptions?.yearly[1]?.price}
                      onChange={() => handleSubChange(1)}
                      checked={
                        subscriptionAmount === subscriptions?.yearly[1]?.price
                      }
                    />
                    <label
                      htmlFor={subscriptions?.yearly[1]?.price}
                      className={styles.radioBtnGroup}
                      style={{
                        backgroundColor:
                          subscriptionAmount === subscriptions?.yearly[1]?.price
                            ? "#0089ff"
                            : "",
                        border:
                          subscriptionAmount === subscriptions?.yearly[1]?.price
                            ? "1px solid #ffffff"
                            : "",
                        color:
                          subscriptionAmount === subscriptions?.yearly[1]?.price
                            ? "#ffffff"
                            : "",
                      }}
                    >
                      <img src={priceBadge} alt="badge" />
                      <span className={styles.previousPrice}>
                        ${subscriptions?.yearly[1]?.previousPrice}
                      </span>
                      ${subscriptions?.yearly[1]?.price}
                    </label>
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
