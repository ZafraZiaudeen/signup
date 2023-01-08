import React from "react";
import styles from "../styles/SignUp.module.css";
import newStyles from "../styles/PayForward.module.css";
import star from "../images/ratingStar.svg";
import priceBadge from "../images/pricebadge.svg";

import Loader from "../components/Loader";
import arrowForward from "../images/arrowOnly.svg";

export default function PayForwardScreen({
  name,
  setPayPeriod,
  subAmounts,
  setSubAmounts,
  subscriptionAmount,
  setSubscriptionAmount,
  payPeriod,
  getTriangleLeft,
  getText,
  handleSubmitSub,
  loading,
  setStep,
  userCreated,
}) {
  const handleGoBack = () => {
    setStep("3");
  };

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
        <div className={styles.innerContainer}>
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
                  let key = Object.keys(subAmounts).find(
                    (k) => subAmounts[k] === subscriptionAmount
                  );
                  const amounts = {
                    left: "$0.99",
                    mid: "$3.99",
                    right: "$9.99",
                  };
                  setSubAmounts(amounts);
                  setSubscriptionAmount(amounts[key]);
                }}
                className={payPeriod === "monthly" ? styles.activePeriod : ""}
              >
                MONTHLY
                <div
                  className={
                    payPeriod === "monthly"
                      ? `${styles.PeriodUnderline} ${styles.activePeriodUnderline}`
                      : styles.PeriodUnderline
                  }
                ></div>
                <span className={styles.youSave}>Save 18%</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  let key = Object.keys(subAmounts).find(
                    (k) => subAmounts[k] === subscriptionAmount
                  );
                  setPayPeriod("yearly");
                  const amounts = {
                    left: "$11.88",
                    mid: "$47.88",
                    right: "$119.88",
                  };
                  setSubAmounts(amounts);
                  setSubscriptionAmount(amounts[key]);
                }}
                className={payPeriod === "yearly" ? styles.activePeriod : ""}
              >
                YEARLY
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
              {payPeriod === "monthly" ? (
                <div className={styles.monthlyPrices}>
                  <input
                    type="radio"
                    name="price"
                    value="$0.99"
                    id="$0.99"
                    onChange={(e) => setSubscriptionAmount(subAmounts["left"])}
                    checked={subscriptionAmount === "$0.99"}
                  />
                  <label
                    htmlFor="$0.99"
                    className={styles.radioBtnGroup}
                    style={{
                      backgroundColor:
                        subscriptionAmount === "$0.99" ? "#0089ff" : "",
                      border:
                        subscriptionAmount === "$0.99"
                          ? "1px solid #ffffff"
                          : "",
                      color: subscriptionAmount === "$0.99" ? "#ffffff" : "",
                    }}
                  >
                    <img src={priceBadge} alt="badge" />
                    <span className={styles.previousPrice}>$3</span>
                    $0.99
                  </label>
                  <input
                    type="radio"
                    name="price"
                    value="$3.99"
                    id="$3.99"
                    onChange={(e) => setSubscriptionAmount(subAmounts["mid"])}
                    checked={subscriptionAmount === "$3.99"}
                  />
                  <label
                    htmlFor="$3.99"
                    className={styles.radioBtnGroup}
                    style={{
                      backgroundColor:
                        subscriptionAmount === "$3.99" ? "#0089ff" : "",
                      border:
                        subscriptionAmount === "$3.99"
                          ? "1px solid #ffffff"
                          : "",
                      color: subscriptionAmount === "$3.99" ? "#ffffff" : "",
                    }}
                  >
                    <img src={priceBadge} alt="badge" />
                    <span className={styles.previousPrice}>$9</span>
                    $3.99
                  </label>
                  <input
                    type="radio"
                    name="price"
                    value="$9.99"
                    id="$9.99"
                    onChange={(e) => setSubscriptionAmount(subAmounts["right"])}
                    checked={subscriptionAmount === "$9.99"}
                  />
                  <label
                    htmlFor="$9.99"
                    className={styles.radioBtnGroup}
                    style={{
                      backgroundColor:
                        subscriptionAmount === "$9.99" ? "#0089ff" : "",
                      border:
                        subscriptionAmount === "$9.99"
                          ? "1px solid #ffffff"
                          : "",
                      color: subscriptionAmount === "$9.99" ? "#ffffff" : "",
                    }}
                  >
                    <img src={priceBadge} alt="badge" />
                    <span className={styles.previousPrice}>$19</span>
                    $9.99
                  </label>
                </div>
              ) : (
                <div className={styles.yearlyPrices}>
                  <input
                    type="radio"
                    name="price"
                    value="$11.88"
                    id="$11.88"
                    onChange={(e) => setSubscriptionAmount(subAmounts["left"])}
                    checked={subscriptionAmount === "$11.88"}
                  />
                  <label
                    htmlFor="$11.88"
                    className={styles.radioBtnGroup}
                    style={{
                      backgroundColor:
                        subscriptionAmount === "$11.88" ? "#0089ff" : "",
                      border:
                        subscriptionAmount === "$11.88"
                          ? "1px solid #ffffff"
                          : "",
                      color: subscriptionAmount === "$11.88" ? "#ffffff" : "",
                    }}
                  >
                    <img src={priceBadge} alt="badge" />
                    <span className={styles.previousPrice}>$15</span>
                    $11.88
                  </label>
                  <input
                    type="radio"
                    name="price"
                    value="$47.88"
                    id="$47.88"
                    onChange={(e) => setSubscriptionAmount(subAmounts["mid"])}
                    checked={subscriptionAmount === "$47.88"}
                  />
                  <label
                    htmlFor="$47.88"
                    className={styles.radioBtnGroup}
                    style={{
                      backgroundColor:
                        subscriptionAmount === "$47.88" ? "#0089ff" : "",
                      border:
                        subscriptionAmount === "$47.88"
                          ? "1px solid #ffffff"
                          : "",
                      color: subscriptionAmount === "$47.88" ? "#ffffff" : "",
                    }}
                  >
                    <img src={priceBadge} alt="badge" />
                    <span className={styles.previousPrice}>$56</span>
                    $47.88
                  </label>
                  <input
                    type="radio"
                    name="price"
                    value="$119.88"
                    id="$119.88"
                    onChange={(e) => setSubscriptionAmount(subAmounts["right"])}
                    checked={subscriptionAmount === "$119.88"}
                  />
                  <label
                    htmlFor="$119.88"
                    className={styles.radioBtnGroup}
                    style={{
                      backgroundColor:
                        subscriptionAmount === "$119.88" ? "#0089ff" : "",
                      border:
                        subscriptionAmount === "$119.88"
                          ? "1px solid #ffffff"
                          : "",
                      color: subscriptionAmount === "$119.88" ? "#ffffff" : "",
                    }}
                  >
                    <img src={priceBadge} alt="badge" />
                    <span className={styles.previousPrice}>$130</span>
                    $119.88
                  </label>
                </div>
              )}
              <div className={styles.packageText}>
                <div
                  className={styles.triangle}
                  style={{ left: getTriangleLeft() }}
                ></div>
                {getText()}
              </div>
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
