import React, { useEffect } from "react";
import styles from "../styles/SignUp.module.css";
import star from "../images/ratingStar.svg";
import priceBadge from "../images/pricebadge.svg";

import Loader from "../components/Loader";

export default function PayForwardScreenB({
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
}) {
  useEffect(() => {
    setSubscriptionAmount(subAmounts["right"]);
  }, []);

  return (
    <div className={styles.welcome}>
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
                    right: "$9.99",
                  };
                  setSubAmounts(amounts);
                  setSubscriptionAmount(amounts[key]);
                }}
                className={payPeriod === "monthly" ? styles.activePeriod : ""}
              >
                <div className={styles.topText}>PAY MONTHLY</div>
                <span className={styles.commitPeriod}>Commit Monthly</span>
                <div
                  className={
                    payPeriod === "monthly"
                      ? `${styles.PeriodUnderline} ${styles.activePeriodUnderline}`
                      : styles.PeriodUnderline
                  }
                ></div>
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
                <div className={styles.topText}>
                  UP FRONT
                  <span className={styles.youSave}>Save 50%</span>
                </div>
                <span className={styles.commitPeriod}>Commit Annually</span>
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
                <div
                  className={`${styles.monthlyPrices} ${styles.monthlyYearlyB}`}
                >
                  <span className={styles.mostPopular}>Most Popular</span>
                  <input
                    type="radio"
                    name="price"
                    value="$9.99"
                    id="$9.99"
                    onChange={(e) => setSubscriptionAmount(subAmounts["mid"])}
                    checked={subscriptionAmount === "$9.99"}
                  />

                  <label
                    htmlFor="$9.99"
                    className={`${styles.radioBtnGroup} ${styles.longLabel}`}
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
                <div
                  className={`${styles.yearlyPrices} ${styles.monthlyYearlyB}`}
                >
                  <span className={styles.mostPopular}>Most Popular</span>
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
                    className={`${styles.radioBtnGroup} ${styles.longLabel}`}
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
