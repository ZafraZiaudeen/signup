import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/dropOff.module.scss";
import payments from "../api/payments";
import userApi from "../api/user";

import { useDispatch, useSelector } from "react-redux";
import { setClientData, setCouponData } from "../actions/common";

export default function SubscriptionFailedScreen() {
  const urlInfo = useRef(null);

  const dispatch = useDispatch();

  const clientData = useSelector((state) => state.common).clientData;

  const handleNewPaymentIntent = useCallback(
    async (result) => {
      const data = {
        customerId: result.subscription.customer,
        subscriptionId: result.subscription.id,
        clientSecret:
          result?.subscription?.latest_invoice?.payment_intent?.client_secret ||
          result?.client_secret,
        paymentIntentId: result?.paymentIntentId,
      };

      dispatch(
        setClientData({
          ...clientData,
          email: urlInfo.current?.email,
          paymentIntent: data,
        })
      );

      localStorage.setItem(
        "signUpForm",
        JSON.stringify({
          email: clientData.email,
          name: result.name,
          payPeriod: "yearly",
          planId: null,
          step: "welcome",
          subscriptionAmount: 47.98,
          welcomeStep: "2",
        })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: urlInfo.current.email,
          token: urlInfo.current.token,
        })
      );

      sessionStorage.setItem("subscriptionRenew", true);
      window.location.replace("/");
    },
    [dispatch, clientData, urlInfo.current]
  );

  const getRenewIntent = async () => {
    const email = window.location.search.split("email=")[1]?.split("&")[0];
    const token = window.location.search.split("token=")[1];

    const result = await payments.renewSubscription({ token, email });

    if (!result.clientSecret) return handleNewPaymentIntent(result);

    dispatch(
      setClientData({
        ...clientData,
        paymentIntent: result,
      })
    );

    localStorage.setItem(
      "signUpForm",
      JSON.stringify({
        email,
        name: result.name,
        payPeriod: "yearly",
        planId: null,
        step: "welcome",
        subscriptionAmount: 47.98,
        welcomeStep: "2",
      })
    );

    sessionStorage.setItem("subscriptionRenew", true);
    window.location.replace("/");
  };

  useEffect(() => {
    getRenewIntent();
  }, []);

  useEffect(() => {
    (async () => {
      const query = new URLSearchParams(window.location.search);
      const email = query.get("email");
      const token = query.get("token");

      // console.log(email);
      if (!email) return;
      urlInfo.current = { email, token };

      const userRes = await userApi.getUserByEmail({
        email: email,
      });

      if (userRes.data.data._id) {
        const user = userRes.data.data;
        dispatch(
          setClientData({ ...clientData, email: user.email, name: user.name })
        );
      }
    })();
  }, []);

  return (
    <div className={styles.dropOffContainer}>
      <div className={styles.ovalOne} />
      <div className={styles.ovalTwo} />
      <div className={styles.ovalThree} />
      <div className={styles.ovalFour} />
      <div className={styles.content}>
        <span className={`${styles.subtitle} ${styles.textFocusIn}`}>
          Oops! It's an issue with your subscription
        </span>
        <span className={`${styles.title} ${styles.textFocusIn} `}>
          Don't worry, let's fix it...
        </span>
      </div>
    </div>
  );
}
