import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCoupon, setCouponData, setFromSession, setVerificationPopup } from "../actions/common";
import payments from "../api/payments";
import styles from "../styles/verification.module.scss";
import animations from "../styles/animations.module.css";
import { mirage } from 'ldrs'

import VerifiedIcon from "../images/verified.svg";
import closeX from "../images/black_x.svg";
import whiteX from "../images/white_x.svg";
import user from "../api/user";

export default function VerificationInput({ email, onSuccess, resend }) {
  mirage.register()

  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const couponInputRef = useRef();
  const couponData = useSelector((state) => state.common).couponData;


  const visible = useSelector((state) => state.common).verificationPopup;
  const dispatch = useDispatch();

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(setVerificationPopup(false));
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setCode(value)
    setError("");
  };

  const handleSubmit = async (e, fromSession) => {
    e?.preventDefault();
    setLoading(true);

    const result = await user.verifyEmailCode({ email, code });
    if (result?.data?.success) {
      dispatch(setVerificationPopup(false));
      setLoading(false);
      onSuccess();
      return;
    }
    setLoading(false);
    setError("Invalid code");
  };

  const handleResend = async (e) => {
    e.preventDefault();
    resend();
  }


  if (visible)
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.container} ${animations.scaleUpCenter}`}>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src={closeX} className={styles.closeIcon} alt="" />
            <img src={whiteX} className={styles.whiteX} alt="" />
          </button>
          <div className={styles.header}>
            <img src={VerifiedIcon} className={styles.couponIcon} alt="" />
            <span className={styles.title}>Let's verify the email</span>
          </div>
          <p className={styles.description}>
            Ready to seal the deal? Verify your email address to complete your registration.

          </p>
          <div className={styles.inputBackground} >
            <div className={styles.inputWrapper}>
              <div className={styles.gradientWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={couponData?.code}
                  placeholder="123456"
                  onChange={handleChange}
                  value={code}
                  disabled={loading}
                  ref={couponInputRef}
                />
              </div>
              <span className={styles.errorMessages}>{error}</span>
            </div>
            <button
              className={styles.button}
              onClick={handleSubmit}
              disabled={loading || (couponData?.code === code)}
            >
              {loading && (
                <l-mirage
                  size="60"
                  speed="2.5"
                  color="white"
                ></l-mirage>

              )}
              {!loading && "Verify"}
            </button>
            <div className={styles.resend}>Haven't received the email? <a href="#" onClick={handleResend}>Resend</a></div>
          </div>
        </div>
      </div >
    );
  return <></>;
}
