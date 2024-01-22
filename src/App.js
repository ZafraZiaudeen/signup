import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import SignUp from "./screens/SignUp";
import CheckoutScreen from "./screens/CheckoutScreen";
import config from "./config/config";

import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import CanvasBackground from "./components/CanvasBackground";

const trackingId = "G-3QHV5V4XDL";
ReactGA.initialize(trackingId);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signUp, setSignUp] = useState(true);
  const [subscribed, setSubscribed] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const location = useLocation();
  // const [bgImage, setBgImage] = useState(
  //   "https://i.postimg.cc/cLjZm9RS/default-01.jpg"
  // );
  const [bgImage, setBgImage] = useState("");
  const [dailyQuestion, setDailyQuestion] = useState("");
  const [checkoutPage, setCheckoutPage] = useState(false);
  const [clientData, setClientData] = useState({});
  const [outerHeight, setOuterHeight] = useState("100vh");
  const [userCreated, setUserCreated] = useState(false);
  const [loading, setLoading] = useState(false);
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
        .get(`${config.serverUrl}images/${today}`)
        .then((res) => {
          if (res.data.image) {
            localStorage.setItem(
              `beatific-image-${todayParsed}`,
              res.data.image
            );
            setBgImage(res.data.image);
          } else if (!res.data.image && res.message === "Image not found") {
            console.log("Image not found");
            // localStorage.setItem(
            //   `beatific-image-${todayParsed}`,
            //   "https://i.postimg.cc/cLjZm9RS/default-01.jpg"
            // );
            // setBgImage("https://i.postimg.cc/cLjZm9RS/default-01.jpg");
          }
        })
        .catch((err) => {
          // localStorage.setItem(
          //   `beatific-image-${todayParsed}`,
          //   "https://i.postimg.cc/cLjZm9RS/default-01.jpg"
          // );
          // setBgImage("https://i.postimg.cc/cLjZm9RS/default-01.jpg");
        });
    }

    axios
      .get(`${config.serverUrl}images/${today}`)
      .then((res) => {
        if (res.data.image && res.data.image.toString() !== todayImg) {
          localStorage.setItem(`beatific-image-${todayParsed}`, res.data.image);
        } else if (res.message === "Image not found") {
          console.log("Image not found");
        }
      })
      .catch((err) => {
        if (!todayImg) {
          // localStorage.setItem(
          //   `beatific-image-${todayParsed}`,
          //   "https://i.postimg.cc/cLjZm9RS/default-01.jpg"
          // );
          // setBgImage("https://i.postimg.cc/cLjZm9RS/default-01.jpg");
        }
      });

    if (!tomorrowImg) {
      axios
        .get(`${config.serverUrl}images/${tomorrowDate}`)
        .then((res) => {
          if (res.data.image) {
            localStorage.setItem(
              `beatific-image-${tomorrowDateParsed}`,
              res.data.image
            );
          } else if (res.message === "Image not found") {
            console.log("Image not found");
            // localStorage.setItem(
            //   `beatific-image-${tomorrowDateParsed}`,
            //   "https://i.postimg.cc/cLjZm9RS/default-01.jpg"
            // );
          }
        })
        .catch((err) => {
          // localStorage.setItem(
          //   `beatific-image-${tomorrowDateParsed}`,
          //   "https://i.postimg.cc/cLjZm9RS/default-01.jpg"
          // );
        });
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


  const determineLoggedIn = (loggedInState) => setLoggedIn(loggedInState);
  const wantToSignUp = (goToSignUp) => setSignUp(goToSignUp);
  const subscriptionState = (subscribedOrNot) => setSubscribed(subscribedOrNot);
  const goToForgotPassword = (goOrNot) => setForgotPassword(goOrNot);

  return (
    <>
      <CanvasBackground />
      <div
        className="background-image"
        style={{ backgroundImage: `url(${bgImage})` }}
        ref={appContainerRef}
      />
      <div className="App">
        <div className="overlay" ref={overlayRef}>
          {!checkoutPage && (
            <SignUp
              setLoggedIn={determineLoggedIn}
              wantToSignUp={wantToSignUp}
              isSubscribed={subscriptionState}
              setCheckoutPage={setCheckoutPage}
              clientData={clientData}
              setClientData={setClientData}
              setUserCreated={setUserCreated}
              userCreated={userCreated}
            />
          )}
          {checkoutPage && (
            <CheckoutScreen
              clientData={clientData}
              setCheckoutPage={setCheckoutPage}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
