import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import arrowForward from "../images/arrowOnly.svg";
import spinner from "../images/spinner.svg"

const NextButton = ({ onClick, styles, wait }) => {
  const isLoading = useSelector((state) => state.common)?.loading;
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer;

    const startTimer = () => {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, wait || 200);
    };

    if (isLoading) return startTimer();
    clearTimeout(timer);
    setShowLoading(false);

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.forwardBtn}
      disabled={showLoading}
    >
      {showLoading ? (
        <img
          src={spinner}
          className={styles.buttonSpinner}
          alt="go to next form step"
        />
      ) : (
        <img
          src={arrowForward}
          className={styles.arrowBtn}
          alt="go to next form step"
        />
      )}
    </button>
  );
};

export default NextButton;
