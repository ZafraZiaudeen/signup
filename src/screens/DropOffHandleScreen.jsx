import React, { useEffect, useState } from "react";
import styles from "../styles/dropOff.module.scss";
import userApi from "../api/user";
import paymentApi from "../api/payments";
import { useDispatch } from "react-redux";
import { setClientData, setCouponData } from "../actions/common";

export default function DropOffHandleScreen() {
  const states = {
    START: "START",
    VALIDATED: "VALIDATED",
    PAYMENT_INTENT: "PAYMENT_INTENT",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
  };
  const [couponState, setCouponState] = useState(states.START);
  const dispatch = useDispatch();

  const validateCoupon = async ({ data }) => {
    const { coupon, email, name } = data;
    const couponValidation = await paymentApi.validateCoupon({ coupon });
    console.log(couponValidation)
    
    if (couponValidation.status !== 200) return setCouponState(states.FAILED);
    setTimeout(() => {
      if (couponValidation?.data?.coupon?.active) {
        dispatch(setCouponData({...couponValidation?.data?.coupon}));
        
        setCouponState(states.PAYMENT_INTENT);
        localStorage.setItem(
          "signUpForm",
          JSON.stringify({
            email,
            name,
            payPeriod: "yearly",
            planId: null,
            step: "welcome",
            subscriptionAmount: 47.98,
            welcomeStep: "2",
          })
        );
        
        
        sessionStorage.setItem("coupon", coupon);
        dispatch(setClientData({ email, name }));
        return window.location.replace("/");
      }

      return setCouponState(states.FAILED);
    }, 2000);
  };

  const handleTokenValidation = async (token) => {
    const tokenData = await userApi.getDropOffData(token);
    if (tokenData.status !== 200) return setCouponState(states.FAILED);
    setTimeout(() => {
      setCouponState(states.VALIDATED);

      validateCoupon(tokenData.data);
    }, 2000);
  };

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const token = currentUrl.searchParams.get("token");
    if (!token) return (window.location.href = "/");

    handleTokenValidation(token);
  }, []);
  return (
    <div className={styles.dropOffContainer}>
      <div className={styles.ovalOne} />
      <div className={styles.ovalTwo} />
      <div className={styles.ovalThree} />
      <div className={styles.ovalFour} />
      <div className={styles.content}>
        {couponState !== states.FAILED && (
          <span className={`${styles.subtitle} ${styles.textFocusIn}`}>
            Hang tight
          </span>
        )}
        {couponState === states.START && (
          <span className={`${styles.title} ${styles.textFocusIn} `}>
            Unwrapping your gift...
          </span>
        )}
        {couponState === states.VALIDATED && (
          <span className={`${styles.title} ${styles.textFocusIn} `}>
            We found your coupon! Processing...
          </span>
        )}
        {couponState === states.PAYMENT_INTENT && (
          <span className={`${styles.title} ${styles.textFocusIn} `}>
            Almost there! Calculating the final price...
          </span>
        )}
        {couponState === states.SUCCESS && (
          <span className={`${styles.title} ${styles.textFocusIn} `}>
            Sending you to the payment page...
          </span>
        )}
        {couponState === states.FAILED && (
          <span className={`${styles.title} ${styles.textFocusIn} `}>
            Oh no! Looks like the coupon is invalid...
          </span>
        )}
      </div>
    </div>
  );
}
