import React, { useEffect, useRef, useCallback } from "react";
import styles from "../styles/alert.module.scss";

import { ReactComponent as SuccessIcon } from "../images/successIcon.svg";
import { ReactComponent as FailedIcon } from "../images/black_x.svg";
import { ReactComponent as ErrorBell } from "../images/errorBell.svg";
import { ReactComponent as SuccessBell } from "../images/successNotificationIcon.svg";
import gifBellIcon from "../images/gifBell.gif";

import { useSelector, useDispatch } from "react-redux";
import { updateErrorMessage } from "../actions/common";

export default function Alert({ timer, gifBell }) {
  const alertRef = useRef();
  const dispatch = useDispatch();

  const errorMessage = useSelector((state) => state.common)?.errorMessage;
  const negative = errorMessage?.negative;
  const message = errorMessage?.message;

  const setMessage = useCallback(
    (msg) => {
      dispatch(updateErrorMessage({ message: msg }));
    },
    [dispatch]
  );
  const setNegative = useCallback(
    (bool) => {
      dispatch(updateErrorMessage({ negative: bool }));
    },
    [dispatch]
  );

  const handleClose = () => {
    if (alertRef.current) {
      alertRef.current.classList.add(styles.slideOut);
      setMessage(null);
      setNegative(false);
    }
  };

  useEffect(() => {
    if (!message) return;
    let firstTimer;
    let secondTimer;

    const runTimer = () => {
      firstTimer = setTimeout(() => {
        if (alertRef.current) {
          alertRef.current.classList.add(styles.slideOut);
        }
      }, timer || 10 * 1000);
      secondTimer = setTimeout(() => {
        setMessage(null);
        setNegative(false);
      }, timer + 1000 || 11 * 1000);
    };

    runTimer();

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
      runTimer();
    };
  }, [message, setMessage, timer]);

  if (message)
    return (
      <div className={styles.wrapper}>
        <div
          className={`${styles.alertContainer} ${styles.active}`}
          ref={alertRef}
        >
          {!negative && <SuccessBell />}
          {negative && !gifBell && <ErrorBell />}
          {negative && gifBell && (
            <img src={gifBellIcon} alt="" className={styles.gifBell} />
          )}
          <div className={styles.messageContainer}>
            <span className={styles.messageText}>
              {message ||
                "Oops! Mind typing in the right current password for us? 😊"}
            </span>
            {errorMessage.subText && (
              <span className={styles.messageText}>{errorMessage.subText}</span>
            )}
          </div>
          <div className={styles.iconContainer}>
            <FailedIcon className={styles.alertIcon} onClick={handleClose} />
          </div>
        </div>
      </div>
    );
}
