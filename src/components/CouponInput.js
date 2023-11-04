import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCoupon } from "../actions/common";
import styles from "../styles/couponInput.module.scss";
import animations from "../styles/animations.module.css";

import CouponIcon from "../images/coupon.svg";
import closeIcon from "../images/close.svg";

export default function CouponInput() {
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("Invalid code");
  };

  if (visible)
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.container} ${animations.scaleUpCenter}`}>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src={closeIcon} className={styles.closeIcon} alt="" />
          </button>
          <div className={styles.header}>
            <img src={CouponIcon} className={styles.couponIcon} alt="" />
            <span className={styles.title}>Secret Code? Yes, Please!</span>
          </div>
          <p className={styles.description}>
            Unlock hidden discounts! Enter your secret code and save big.
            <br /> Say ‘Yes, please!’ to savings!
          </p>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.input}
              placeholder="BTFCHPNSPLNR"
              onChange={handleChange}
              value={coupon}
            />
            <span className={styles.errorMessages}>{error}</span>
          </div>
          <button className={styles.button} onClick={handleSubmit}>
            Apply
          </button>
        </div>
      </div>
    );
  return <></>;
}
