import { useState, useEffect, useRef } from "react";
import Countdown from "react-countdown";
import axios from "axios";
import styles from "../styles/verifyScreen.module.css";
import config from "../config/config";
import CanvasBackground from "../components/CanvasBackground";
import extensionApi from "../api/extension";

import emailIcon from "../images/emailIcon.svg";
import emailiconRed from "../images/emailIconRed.svg";
import priceBadge from "../images/pricebadge.svg";
import failedIcon from "../images/failedIcon.svg";
import arrowIcon from "../images/arrow.svg";
import loadingImg from "../images/loading.svg";

function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [bgImage, setBgImage] = useState("");
  const [email, setEmail] = useState(null);
  const [linkSent, setLinkSent] = useState(false);
  const [timerStarted, setTimerStarted] = useState(null);

  const [outerHeight, setOuterHeight] = useState("100vh");
  const appContainerRef = useRef();
  const overlayRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  // get today's date
  const now = new Date();
  const yyyy = now.getFullYear();
  let mm = now.getMonth() + 1;
  let dd = now.getDate();
  const tomorrow = new Date(yyyy, mm, dd + 1);
  const dayTomorrow = tomorrow.getDate();
  const monthTomorrow = tomorrow.getMonth();
  const yearTomorrow = tomorrow.getFullYear();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const todayParsed = `${yyyy}-${parseInt(mm)}-${parseInt(dd)}`;
  const today = `${yyyy}-${mm}-${dd}`;
  const tomorrowDate = `${yearTomorrow}-${monthTomorrow}-${dayTomorrow}`;
  const tomorrowDateParsed = `${yearTomorrow}-${parseInt(
    monthTomorrow
  )}-${parseInt(dayTomorrow)}`;

  useEffect(() => {
    const todayImg = localStorage.getItem(`beatific-image-${todayParsed}`);
    const tomorrowImg = localStorage.getItem(
      `beatific-image-${tomorrowDateParsed}`
    );

    if (todayImg) {
      setBgImage(todayImg);
    } else {
      axios
        .get(`${config.serverUrl}/api/v1/images/${today}`)
        .then((res) => {
          if (res.data.image) {
            localStorage.setItem(
              `beatific-image-${todayParsed}`,
              res.data.image
            );
            setBgImage(res.data.image);
          } else if (!res.data.image && res.message === "Image not found") {
            console.log("Image not found");
          }
        })
        .catch((err) => {});
    }

    axios
      .get(`${config.serverUrl}/api/v1/images/${today}`)
      .then((res) => {
        if (res.data.image && res.data.image.toString() !== todayImg) {
          localStorage.setItem(`beatific-image-${todayParsed}`, res.data.image);
        } else if (res.message === "Image not found") {
          console.log("Image not found");
        }
      })
      .catch((err) => {
        if (!todayImg) {
        }
      });

    if (!tomorrowImg) {
      axios
        .get(`${config.serverUrl}/api/v1/images/${tomorrowDate}`)
        .then((res) => {
          if (res.data.image) {
            localStorage.setItem(
              `beatific-image-${tomorrowDateParsed}`,
              res.data.image
            );
          } else if (res.message === "Image not found") {
            console.log("Image not found");
          }
        })
        .catch((err) => {});
    }
  }, [today, tomorrowDate, todayParsed, tomorrowDateParsed, user]);

  useEffect(() => {
    setOuterHeight(`${window.innerHeight}px`);
    window.addEventListener("resize", () =>
      setOuterHeight(`${window.innerHeight}px`)
    );
    return () => {
      window.removeEventListener("resize", () =>
        setOuterHeight(`${window.innerHeight}px`)
      );
    };
  }, []);

  useEffect(() => {
    if (!appContainerRef.current && !overlayRef.current) return;
    appContainerRef.current.style.maxHeight = outerHeight;
    appContainerRef.current.style.height = outerHeight;
    overlayRef.current.style.height = outerHeight;
  }, [outerHeight]);

  useEffect(() => {
    let timer = setInterval(() => {
      let localImage = localStorage.getItem(`beatific-image${todayParsed}`);
      if (localImage) {
        setBgImage(localImage);
      }
    }, 300);
    setTimeout(() => {
      clearInterval(timer);
    }, 60 * 1000);
  }, []);

  const closeTab = () => {
    extensionApi.openLoginPage();
    // window.close()
  };

  const renderer = ({ seconds, completed }) => {
    if (completed) {
      closeTab();
    } else {
      return (
        <span className={styles.timer}>
          This window will be automatically closed in {seconds} seconds
        </span>
      );
    }
  };

  const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const email = params.get("email");
    const token = params.get("token");
    return { email, token };
  };

  const resend = async () => {
    setLinkSent(true);
    const result = await axios.post(
      `${config.serverUrl}/api/v1/users/resend-email`,
      { email: email.toLowerCase() }
    );
  };

  const handleButtonClick = () => {
    if (!verifySuccess) {
      return resend();
    }
    closeTab();
  };

  useEffect(() => {
    (async () => {
      try {
        const { email, token } = parseQueryString(window.location.search);
        setEmail(email);
        const url = `${config.serverUrl}/api/v1/users/verify-email`;
        if (!email || !token) {
          setLoading(false);
          setVerifySuccess(false);
          console.log("Something is missing");
        }

       const result = await axios.post(url, { email: email.toLowerCase(), token });
        setLoading(false);

        const data = result.data;
        setTimerStarted(true);
        if (data.success) {
          return setVerifySuccess(true);
        }

        return setVerifySuccess(false);
      } catch (e) {}

      // alert(data?.message)
      // window.close()
    })();
  }, []);

  return (
    <>
      <CanvasBackground />

      <div
        className="background-image"
        style={{ backgroundImage: `url(${bgImage})` }}
        ref={appContainerRef}
      />
      <div className="overlay" ref={overlayRef}>
        <div className="App">
          <div className={styles.container}>
            <span className={styles.greeting}>Hi!</span>
            <span className={styles.heading}>Sweet! You are human</span>
            {loading && (
              <div className={styles.card}>
                <div className={styles.loadingImgContainer}>
                  <img src={loadingImg} className={styles.loading} alt="" />
                </div>
              </div>
            )}
            {!loading && (
              <div className={styles.card}>
                <img
                  src={verifySuccess ? emailIcon : emailiconRed}
                  alt=""
                  className={styles.emailIcon}
                />
                <span
                  className={styles.simpleText}
                  style={!verifySuccess ? { color: "red" } : null}
                >
                  EMail verified
                </span>
                <div
                  className={styles.badgeContainer}
                  style={!verifySuccess ? { backgroundColor: "red" } : null}
                >
                  <img
                    src={verifySuccess ? priceBadge : failedIcon}
                    alt=""
                    className={styles.priceBadge}
                  />
                </div>
                <div className={styles.textContainer}>
                  {verifySuccess && (
                    <span className={styles.text}>
                      Woo-hoo! You’re officially verified as a fabulous human –
                      get ready to have a blast on the inside! 🎉😄
                    </span>
                  )}
                  {!verifySuccess && (
                    <span className={styles.text}>
                      Oops! Verification hiccup! Click below to resend email and
                      get in on the fun inside! 💌🎉
                    </span>
                  )}
                  {email && (
                    <button
                      className={styles.button}
                      onClick={handleButtonClick}
                      disabled={linkSent}
                    >
                      {verifySuccess
                        ? "Let's do this"
                        : linkSent
                        ? "Link sent"
                        : "Resend Link"}
                      {!linkSent && (
                        <img
                          src={arrowIcon}
                          alt=""
                          className={styles.arrowIcon}
                        />
                      )}
                    </button>
                  )}
                </div>
                {timerStarted && (
                  <Countdown date={Date.now() + 15000} renderer={renderer} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyEmail;
