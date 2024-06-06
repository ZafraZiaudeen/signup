import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCoupon, setCouponData, setFromSession } from "../actions/common";
import payments from "../api/payments";
import styles from "../styles/couponInput.module.scss";
import animations from "../styles/animations.module.css";
import { mirage } from 'ldrs'

import CouponIcon from "../images/coupon.svg";
import closeX from "../images/black_x.svg";
import whiteX from "../images/white_x.svg";

export default function CouponInput() {
  mirage.register()

  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState(sessionStorage.getItem("coupon") || "");
  const [loading, setLoading] = useState(false);
  const couponInputRef = useRef();
  const couponData = useSelector((state) => state.common).couponData;
  const sessionCoupon = sessionStorage.getItem("coupon");

  const visible = useSelector((state) => state.common).couponOpen;
  const dispatch = useDispatch();

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(toggleCoupon());
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const upperCaseValue = value.toUpperCase();

    setCoupon(upperCaseValue);
    setError("");
  };

  const handleSubmit = async (e, fromSession) => {
    e?.preventDefault();
    setLoading(true);

    const result = await payments.validateCoupon({ coupon });
    if (result?.data?.coupon?.id) {
      // console.log(result)
      dispatch(setCouponData(result?.data?.coupon));
      dispatch(toggleCoupon(false));
      dispatch(setFromSession(!!fromSession));
      setLoading(false);
      return;
    }
    setLoading(false);
    setError("Invalid coupon code");
    sessionStorage.removeItem("coupon");
  };

  useEffect(() => {
    setTimeout(() => {
      //couponData?.code !== sessionCoupon
      if (sessionCoupon && !visible) {
        setCoupon(sessionCoupon);
        handleSubmit(null, true)
      };
    }, 1000);
  }, [dispatch, sessionCoupon, visible]);



  if (visible)
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.container} ${animations.scaleUpCenter}`}>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src={closeX} className={styles.closeIcon} alt="" />
            <img src={whiteX} className={styles.whiteX} alt="" />
          </button>
          <div className={styles.header}>
            <img src={CouponIcon} className={styles.couponIcon} alt="" />
            <span className={styles.title}>Secret Code? Yes, Please!</span>
          </div>
          <p className={styles.description}>
            Unlock hidden discounts! Enter your secret code and save big.
            <br /> Say ‘Yes, please!’ to savings!
          </p>
          <div className={styles.inputBackground} >
            <div className={styles.inputWrapper}>
              <div className={styles.gradientWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={couponData?.code}
                  placeholder="BTFCHPNSPLNR"
                  onChange={handleChange}
                  value={coupon}
                  disabled={loading}
                  ref={couponInputRef}
                />
              </div>
              <span className={styles.errorMessages}>{error}</span>
            </div>
            <button
              className={styles.button}
              onClick={handleSubmit}
              disabled={loading || (couponData?.code === coupon)}
            >
              {loading && (
                <l-mirage
                  size="60"
                  speed="2.5"
                  color="white"
                ></l-mirage>

              )}
              {!loading && "Apply"}
            </button>
          </div>
        </div>
      </div >
    );
  return <></>;
}
