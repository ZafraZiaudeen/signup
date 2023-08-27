import { useState, useRef, useEffect } from "react";
import config from "../config/config";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import userApi from "../api/user";

import {
  WriteEmail,
  WriteName,
  WritePassword,
  WhatIsBeatific,
} from "../components/TypeWriterNew";
import styles from "../styles/SignUp.module.css";
import anims from "../styles/animations.module.css";
import smile from "../images/520464@2x.png";
import smallSmile from "../images/smallsmiley.png";
import padlock from "../images/padlock.svg";
import arrowBtnSignUp from "../images/arrowBtnLoginTransparent.svg";
import arrowForward from "../images/arrowOnly.svg";
import arrowBack from "../images/backArrow.svg";
import mail from "../images/482947.svg";
import lock from "../images/2886699.svg";
import badge from "../images/badgeMark.svg";
import star from "../images/ratingStar.svg";
import priceBadge from "../images/badgeWithCheck.svg";
import happyPerson1 from "../images/happyPerson1.jpg";
import happyPerson2 from "../images/happyPerson2.jpg";
import happyPerson3 from "../images/happyPerson3.jpg";

import eyeOpen from "../images/eyeOpen.svg"
import eyeClosed from "../images/eyeClosed.svg"

import Loader from "../components/Loader";
import payments from "../api/payments";
import Pricing from "../api/pricingPlans";
import extension from "../api/extension";

import PayForwardScreenB from "./PayForwardScreenB";
import PayForwardScreen from "./PayForwardScreen";

// import io from "socket.io-client";

// const socket = io.connect(config.serverUrl, {
//   secure: true,
//   rejectUnauthorized: false,
// });

const stripePromise = loadStripe(
  "pk_test_51MCJIYE9iLxZZhRi4gIxJXtFM0UJ6aCUYosbxOtKn0eQs2fJNO62QHBR8XoQyQTlqPZBhPzygF2NKKM5jEgSMg6C00HNnprEui"
);

const inputStyle = {
  width: "499px",
  height: "51px",
  border: "1px solid #E8E8E8",
  borderRadius: "90px",
  fontSize: "18px",
  color: "#000000",
  background: "#FFFFFFBA 0% 0% no-repeat padding-box",
  padding: "14px 22px 11px 22px",
  margin: "auto",
};

const SignUp = ({
  wantToSignUp,
  setLoggedIn,
  isSubscribed,
  setCheckoutPage,
  clientData,
  setClientData,
  userCreated,
  setUserCreated,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <Child
        wantToSignUp={wantToSignUp}
        setLoggedIn={setLoggedIn}
        isSubscribed={isSubscribed}
        setCheckoutPage={setCheckoutPage}
        clientData={clientData}
        setClientData={setClientData}
        setUserCreated={setUserCreated}
        userCreated={userCreated}
      />
    </Elements>
  );
};

const Child = ({
  wantToSignUp,
  setLoggedIn,
  isSubscribed,
  setCheckoutPage,
  clientData,
  setClientData,
  setUserCreated,
  userCreated,
}) => {
  const [subAmounts, setSubAmounts] = useState({
    left: "$0.99",
    mid: "$3.99",
    right: "$9.99",
  });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [step, setStep] = useState("1");
  const [welcomeStep, setWelcomeStep] = useState("");
  const [videoNumber, setVideoNumber] = useState("1");
  const [payPeriod, setPayPeriod] = useState("monthly");
  const [subscriptionAmount, setSubscriptionAmount] = useState(3.99);
  const [planId, setPlanId] = useState(null);
  const [name, setName] = useState("");
  const [emptyName, setEmptyName] = useState(false);
  const [email, setEmail] = useState("");
  const [emptyEmail, setEmptyEmail] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [alreadyReg, setAlreadyReg] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordInvalidMsg, setPasswordInvalidMsg] = useState(null)
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState("");
  const [pricingPlans, setPricingPlans] = useState([]);
  const [steps, setSteps] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false,
    stepFour: false,
  });
  const [emailParam, setEmailParam] = useState("");
  const [userToken, setUserToken] = useState("");
  const [userCount, setUserCount] = useState(0);

  // const [exists, setExists] = useState('');

  // setting up stripe card component
  // const stripe = useStripe();
  // const elements = useElements();

  // handling socket stuff

  //get pricing plans

  useEffect(() => {
    console.log("planId changed ===>", planId);
  }, [planId]);

  useEffect(() => {
    const fetchPlans = async () => {
      console.log("fetching plans");
      const response = await Pricing.getAllPlans();
      setPricingPlans(response.data[0]);
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (!name) return;
    localStorage.setItem(
      "signUpForm",
      JSON.stringify({
        name: name,
        email: email,
        password: password,
        step: step,
        welcomeStep: welcomeStep,
        payPeriod: payPeriod,
        subscriptionAmount: subscriptionAmount,
        planId: planId,
      })
    );
  }, [name, email, password, step, welcomeStep, payPeriod, subscriptionAmount]);

  useEffect(() => {
    clientData.name = name;
    clientData.subscriptionAmount = subscriptionAmount;
    clientData.planId = planId;
    clientData.email = email;
    clientData.payPeriod = payPeriod;
    setClientData({ ...clientData });
  }, [name, subscriptionAmount, email, payPeriod, planId]);

  useEffect(() => {
    const saved = localStorage.getItem("signUpForm");
    if (!saved) return;

    const JSONified = JSON.parse(saved);
    if (JSONified.step !== step) setStep(JSONified.step);
    if (JSONified.name) setName(JSONified.name);
    if (JSONified.email) setEmail(JSONified.email);
    if (JSONified.password) setPassword(JSONified.password);
    if (JSONified.welcomeStep) setWelcomeStep(JSONified.welcomeStep);
    if (JSONified.payPeriod) setPayPeriod(JSONified.payPeriod);
    if (JSONified.subscriptionAmount)
      setSubscriptionAmount(JSONified.subscriptionAmount);
  }, []);

  const handleNameNext = () => {
    if (name.trim() === "") {
      setEmptyName(true);
      return;
    }
    setStep("2");
  };

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (email.trim() === "") setEmptyEmail(true);

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      setInvalidEmail(true);
    } else if (email && emailRegex.test(email)) {
      checkIfAccountExists(email);
    }
  };

  // on render
  useEffect(() => {
    if (step === "1") {
      nameRef.current.focus();
    } else if (step === "2") {
      steps.stepOne = true;
      setSteps({ ...steps });
      emailRef.current.focus();
    } else if (step === "3") {
      steps.stepTwo = true;
      setSteps({ ...steps });
      passwordRef.current.focus();
    }

    if (welcomeStep === "1") {
      steps.stepThree = true;
      setSteps({ ...steps });
      document.body.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          setWelcomeStep("2");
        }
      });
    }

    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          setWelcomeStep("2");
        }
      });
    };
  }, [step, welcomeStep]);

  useEffect(() => {
    if (!clicked && password.trim() !== "") setPasswordVisible(false)
  }, [password])

  // switching images on interval
  useEffect(() => {
    if (welcomeStep === "1") {
      const interval = setInterval(() => {
        if (videoNumber === "1") {
          setVideoNumber("2");
        } else if (videoNumber === "2") {
          setVideoNumber("3");
        } else if (videoNumber === "3") {
          setVideoNumber("1");
        }
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [videoNumber, welcomeStep]);

  useEffect(() => {
    (async () => {
      const query = new URLSearchParams(window.location.search);
      const email = query.get("email");
      const token = query.get("token");
      setEmailParam(email);
      setUserToken(token);
      console.log(email);
      if (!email) return;
      const subscribed = await userApi.checkIfSubscribed({
        email: email,
      });
      if (subscribed?.data?.message === "false") {
        setStep("welcome");
        setWelcomeStep("2");
      }
    })();
  }, []);

  useEffect(() => {
    console.log("welcomeStep changed ===>", welcomeStep);
  }, [welcomeStep]);

  // form validation
  const handleEmailChange = (e) => {
    setEmptyEmail(false);
    setInvalidEmail(false);
    setAlreadyReg(false);
    setEmail(e.target.value);
    const emailInput = document.getElementById("emailGroup");
    const warning = document.getElementById("warning");

    if (email) {
      if (warning) warning.style.display = "none";
      if (emailInput) emailInput.style.border = "none";
    }
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
    setPasswordInvalidMsg(null)
  }

  const handleClick = (e) => {
    setClicked(true)
    setPasswordVisible(!passwordVisible);
  };

  const checkIfAccountExists = (email) => {
    axios
      .post(
        config.serverUrl + "/check-account",
        { email },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        console.log(res);
        // setExists(res.data.message);
        if (res.data.message === "exists") {
          setAlreadyReg(true);
          // wantToSignUp(false);
        } else {
          setStep("3");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPaymentIntent = () => {
    return new Promise(async (resolve) => {
      let customerResult = await payments.createCustomer({
        email: clientData.email,
        name: clientData.name,
      });
      let subscriptionResult = await payments.createSubscription({
        customerId: customerResult.data.customer.id,
        price: clientData.subscriptionAmount,
        planId: clientData.planId,
      });
      console.log({ customerResult });
      console.log({ subscriptionResult });
      resolve({
        customerId: customerResult.data.customer.id,
        subscriptionId: subscriptionResult.data.subscription.id,
        clientSecret:
          subscriptionResult.data.subscription.latest_invoice.payment_intent
            .client_secret,
      });
    });
  };

  const handleActivateSubscribtion = async () => {
    const user = await userApi.getUserByEmail({
      email: emailParam,
    });

    setUserCreated(true);
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user.data.data, token: userToken })
    );
    let paymentIntentResult = await getPaymentIntent();
    clientData.email = emailParam;
    clientData.name = user.data.data.name;
    clientData.paymentIntent = paymentIntentResult;
    setClientData(clientData);
    setLoading(false);
    setCheckoutPage(true);
  };

  const handleSubmitSub = async (e) => {
    if (emailParam) return handleActivateSubscribtion();

    setLoading(true);
    e.preventDefault();

    // setLoading(true);

    const userData = {
      name,
      email,
      password,
    };

    const user = await axios.post(config.serverUrl + "/api/v1/users", userData);
    if (user) {
      setUserCreated(true);
      localStorage.setItem("user", JSON.stringify(user.data));
      let paymentIntentResult = await getPaymentIntent();

      clientData.paymentIntent = paymentIntentResult;
      setClientData(clientData);
      setLoading(false);
      setCheckoutPage(true);
      // window.open(
      //   `http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/subscribe.html?name=${name}&email=${email}&price=${subscriptionAmount}`,
      //   "_blank"
      // );
    }
  };


  const displayImg = () => {
    if (videoNumber === "1") {
      return (
        <img
          src={happyPerson1}
          className={styles.placeHolderImg}
          alt="Happy person 1"
        />
      );
    } else if (videoNumber === "2") {
      return (
        <img
          src={happyPerson2}
          className={styles.placeHolderImg}
          alt="Happy person 2"
        />
      );
    } else if (videoNumber === "3") {
      return (
        <img
          src={happyPerson3}
          className={styles.placeHolderImg}
          alt="Happy person 3"
        />
      );
    }
  };

  const getText = () => {
    if (subscriptionAmount === "$0.99" || subscriptionAmount === "$11.88") {
      return "Join our family";
    } else if (
      subscriptionAmount === "$3.99" ||
      subscriptionAmount === "$47.88"
    ) {
      return "Join our family and pay forward for one person";
    } else if (
      subscriptionAmount === "$9.99" ||
      subscriptionAmount === "$119.88"
    ) {
      return "Join our family and pay forward for two people";
    }
  };

  const getTriangleLeft = () => {
    // const pos = Object.keys(subAmounts).find(
    //   (key) => subAmounts[key] === subscriptionAmount
    // );
    // return pos === "left" ? "17%" : pos === "mid" ? "50%" : "80%";
    return "17%";
  };

  // const handleRadioButtonChange = (e) => setSubscriptionAmount(e.target.value)

  let insideForm;
  if (step === "1") {
    insideForm = (
      <div className={styles.formAction}>
        <label htmlFor="name" className={styles.how}>
          <span
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
              rowGap: 30
            }}
          >
            <WriteName steps={steps} setSteps={setSteps} />
          </span>
        </label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", rowGap: 30
          }}
        >
          <div className={styles.inputSection}>
            <div
              className={
                emptyName
                  ? `${styles.formInputWrapper} ${styles.wrapperError}`
                  : styles.formInputWrapper
              }
              style={{ marginLeft: "142.5px" }}
            >
              <div className={styles.formInput} id="nameInput">
                <span className={styles.icon}>
                  <img
                    src={smallSmile}
                    className={styles.smallSmile}
                    alt="smile icon"
                  />
                </span>
                <div className={styles.inputAndWarning}>
                  {/* <p
                  id="warning"
                  style={{ color: "#FF0000" }}
                  className={styles.warning}
                >
                  Name cannot be blank.
                </p> */}
                  <input
                    ref={nameRef}
                    style={{
                      paddingLeft: "10px",
                      width: "560px",
                      height: "40px",
                    }}
                    type="text"
                    name="name"
                    id="name"
                    onChange={(e) => {
                      setName(e.target.value);
                      setEmptyName(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        e.preventDefault();
                        handleNameNext();
                      }
                    }}
                    value={name}
                    required
                  />
                  {emptyName && (
                    <span className={styles.requiredMsg}>
                      Name cannot be a blank
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleNameNext()}
              className={styles.forwardBtn}
            >
              <img
                src={arrowForward}
                className={styles.arrowBtn}
                alt="go to next form step"
              />
            </button>
          </div>
          <div className={styles.badgeSection}>
            <img
              src={badge}
              className={`${styles.badge} ${anims.scaleUpCenter}`}
              alt="badge"
            />
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
      </div >
    );
  } else if (step === "2") {
    insideForm = (
      <div className={styles.formAction}>
        <label htmlFor="name">
          <span
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
            }}
          >
            <span style={{ fontSize: "2px", color: "transparent" }}>This</span>
            <WriteEmail steps={steps} setSteps={setSteps} />
          </span>
        </label>
        <div className={styles.inputSection}>
          <button
            type="button"
            onClick={() => {
              setStep("1");
            }}
            className={styles.backBtn}
          >
            <img
              src={arrowForward}
              className={styles.backArrowBtn}
              alt="go to previous form step"
            />
          </button>
          <div className={styles.inputAndWarning}>
            {/* <p
              id="warning"
              style={{ color: "#FF0000" }}
              className={styles.warning}
            >
              Invalid email address. Valid e-mail can contain only latin
              letters, numbers, '@' and '.'
            </p> */}
            <div
              className={
                emptyEmail || invalidEmail || alreadyReg
                  ? `${styles.formInputWrapper} ${styles.wrapperError}`
                  : styles.formInputWrapper
              }
            >
              <div id="emailGroup" className={styles.formInput}>
                <span className={styles.icon}>
                  <img src={mail} className={styles.mail} alt="mail icon" />
                </span>
                <input
                  style={{ paddingLeft: "10px" }}
                  ref={emailRef}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email"
                  onChange={handleEmailChange}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") handleEmailNext(e);
                  }}
                  value={email}
                // required
                />
                <span className={styles.requiredMsg} style={{ left: "58%" }}>
                  {emptyEmail
                    ? "Email Required"
                    : invalidEmail
                      ? "Invalid email address"
                      : alreadyReg
                        ? "This email has already been used to create an account with us!"
                        : ""}
                  {alreadyReg && (
                    <span
                      className={styles.whiteError}
                      onClick={() => extension.openLoginPage()}
                    >
                      Go to login
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => handleEmailNext(e)}
            className={styles.forwardBtn}
          >
            <img
              src={arrowForward}
              className={styles.arrowBtn}
              alt="go to next form step"
            />
          </button>
        </div>
        <div className={styles.badgeSection}>
          <img src={badge} className={styles.badge} alt="badge" />
          <img
            src={badge}
            className={`${styles.badge} ${anims.scaleUpCenter}`}
            style={{ marginLeft: "-20px" }}
            alt="badge"
          />
          <div className={styles.dot}></div>
        </div>
      </div>
    );
  } else if (step === "3") {
    insideForm = (
      <div className={styles.formAction}>
        <label htmlFor="name">
          <span
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <span style={{ fontSize: "2px", color: "transparent" }}>This</span>
            <WritePassword steps={steps} setSteps={setSteps} />
          </span>
        </label>
        <div className={styles.inputSection}>
          <button
            type="button"
            onClick={() => setStep("2")}
            className={styles.backBtn}
          >
            <img
              src={arrowForward}
              className={styles.backArrowBtn}
              alt="go to previous form step"
            />
          </button>
          <div className={styles.formInput} id="emailGroup">
            <span className={styles.icon}>
              <img src={lock} alt="lock icon" className={styles.lock} />
            </span>
            <input
              style={{ paddingLeft: "10px" }}
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="password"
              ref={passwordRef}
              onChange={handlePasswordChange}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault()
                  if (e.target.value.trim() === "") {
                    return setPasswordInvalidMsg("Password cannot be empty!")
                  }
                  setStep("welcome");
                  setWelcomeStep("2");
                }
              }}
              value={password}
            />

            <span className={styles.showPass} onClick={handleClick}>
              {(passwordVisible) ? (
                <img src={eyeOpen} className={styles.eye} alt="" />
              ) : (
                <img src={eyeClosed} className={styles.eye} alt="" />
              )}
            </span>
            {passwordInvalidMsg && (
              <span className={styles.requiredMsg}>
                {passwordInvalidMsg}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {

              if (password.trim() === "") { console.log('empty'); return setPasswordInvalidMsg("Password cannot be emtpy!"); }
              setStep("welcome");
              setWelcomeStep("2");
            }}
            className={styles.forwardBtn}

          >
            <img
              src={arrowForward}
              className={styles.arrowBtn}
              alt="go to next form step"
            />
          </button>
        </div>
        <div className={styles.badgeSection}>
          <img src={badge} className={styles.badge} alt="badge" />
          <img
            src={badge}
            className={styles.badge}
            alt="badge"
            style={{ marginLeft: "-20px" }}
          />
          <img
            src={badge}
            className={`${styles.badge} ${anims.scaleUpCenter}`}
            alt="badge"
            style={{ marginLeft: "-20px" }}
          />
        </div>
      </div>
    );
  }

  let welcome;
  if (welcomeStep === "1") {
    welcome = (
      <div className={styles.welcome}>
        <div className={styles.mainSection}>
          <h1>Welcome</h1>
          <h2>
            <span
              style={{
                width: "125%",
                display: "flex",
              }}
            >
              <span style={{ fontSize: "2px", color: "transparent" }}>
                This
              </span>
              <WhatIsBeatific steps={steps} setSteps={setSteps} />
            </span>
          </h2>
          <div className={styles.innerContainer}>
            <div className={styles.videoDisplay}>{displayImg()}</div>
            <div className={styles.progressDots}>
              <button
                type="button"
                onClick={() => setVideoNumber("1")}
                className={styles.videoDotBtn}
                style={{
                  border: videoNumber === "1" ? "0.5px solid #42b72a" : "none",
                }}
              >
                <div
                  className={styles.innerDot}
                  style={{
                    backgroundColor:
                      videoNumber === "1" ? "#42b72a" : "#000000",
                  }}
                ></div>
              </button>
              <button
                type="button"
                onClick={() => setVideoNumber("2")}
                className={styles.videoDotBtn}
                style={{
                  border: videoNumber === "2" ? "0.5px solid #42b72a" : "none",
                }}
              >
                <div
                  className={styles.innerDot}
                  style={{
                    background:
                      videoNumber === "2"
                        ? "#42b72a 0% 0% no-repeat padding-box"
                        : "#000000 0% 0% no-repeat padding-box",
                  }}
                ></div>
              </button>
              <button
                type="button"
                onClick={() => setVideoNumber("3")}
                className={styles.videoDotBtn}
                style={{
                  border: videoNumber === "3" ? "0.5px solid #42b72a" : "none",
                }}
              >
                <div
                  className={styles.innerDot}
                  style={{
                    background:
                      videoNumber === "3"
                        ? "#42b72a 0% 0% no-repeat padding-box"
                        : "#000000 0% 0% no-repeat padding-box",
                  }}
                ></div>
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setWelcomeStep("2")}
          className={styles.forwardBtn}
        >
          <img
            src={arrowForward}
            className={styles.arrowBtn}
            alt="go to next form step"
          />
        </button>
      </div>
    );
  } else if (welcomeStep === "2") {
    // welcome =
    //   userCount % 2 === 0 ? (
    //     <PayForwardScreenB
    //       name={name}
    //       setPayPeriod={setPayPeriod}
    //       subAmounts={subAmounts}
    //       setSubAmounts={setSubAmounts}
    //       subscriptionAmount={subscriptionAmount}
    //       setSubscriptionAmount={setSubscriptionAmount}
    //       payPeriod={payPeriod}
    //       getText={getText}
    //       getTriangleLeft={getTriangleLeft}
    //       handleSubmitSub={handleSubmitSub}
    //       loading={loading}
    //     />
    //   ) : (
    //     <PayForwardScreen
    //       name={name}
    //       setPayPeriod={setPayPeriod}
    //       subAmounts={subAmounts}
    //       setSubAmounts={setSubAmounts}
    //       subscriptionAmount={subscriptionAmount}
    //       setSubscriptionAmount={setSubscriptionAmount}
    //       payPeriod={payPeriod}
    //       getText={getText}
    //       getTriangleLeft={getTriangleLeft}
    //       handleSubmitSub={handleSubmitSub}
    //       loading={loading}
    //     />
    //   );
    welcome = (
      <PayForwardScreen
        name={name}
        setPayPeriod={setPayPeriod}
        subAmounts={subAmounts}
        setSubAmounts={setSubAmounts}
        subscriptionAmount={subscriptionAmount}
        setSubscriptionAmount={setSubscriptionAmount}
        setPlanId={setPlanId}
        payPeriod={payPeriod}
        getText={getText}
        getTriangleLeft={getTriangleLeft}
        handleSubmitSub={handleSubmitSub}
        loading={loading}
        setLoading={setLoading}
        setStep={setStep}
        userCreated={userCreated}
        plans={pricingPlans}
      />
    );
  } else if (welcomeStep === "3") {
    welcome = (
      <div className={styles.welcome}>
        <button
          type="button"
          onClick={() => setWelcomeStep("2")}
          className={styles.backBtn}
        >
          <img
            src={arrowBack}
            className={styles.backArrowBtn}
            alt="go to previous form step"
          />
        </button>
        <div className={styles.mainSection} style={{ marginRight: "142.5px" }}>
          {name &&
            (name ? (
              <p>I'm {name} it feels good to</p>
            ) : (
              <p>It feels good to</p>
            ))}
          <h2>Pay Forward</h2>

          <div className={styles.innerContainer}>
            <div className={styles.priceDisplay}>
              <img src={lock} alt="lock" />
              <p>100% secure</p>
              <div className={styles.price}>
                <img src={priceBadge} alt="badge" />
                <p>{subscriptionAmount && subscriptionAmount}</p>
              </div>
            </div>
            <div className={styles.cardSection}>
              <form onSubmit={handleSubmitSub}>
                <div style={inputStyle}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          iconColor: "rgb(193,157,244)",
                        },
                      },
                    }}
                  />
                </div>
                <button type="submit" className={styles.buttonWithLoader}>
                  <span>{loading ? <Loader /> : "PAY FORWARD"}</span>
                </button>
              </form>
            </div>
            <p
              style={{
                fontFamily: "Varela Round",
                letterSpacing: "0",
                fontSize: "14px",
                color: "#696969",
                marginBottom: "24px",
                marginTop: "41px",
              }}
            >
              Powered by Stripe
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {step === "welcome" ? (
        <>{welcome}</>
      ) : (
        <>
          <section className={styles.signUpActions}>
            <div className={styles.iconSection}>
              <img
                width={step === "2" ? 65 : 68}
                height={step === "2" ? 65 : 68}
                src={step === "2" ? padlock : smile}
                className={step === "2" ? styles.padlockImg : styles.smileImg}
                alt={step === "2" ? "Padlock" : "Smiling face"}
              />
            </div>
            <h1 className={styles.greeting}>
              Hi {name && (name ? name : "Amazing")}!
            </h1>
            <form>{insideForm}</form>
          </section>
          <div className={styles.footerLinks}>
            <p className={styles.footerP}>HAVE AN ACCOUNT?</p>
            <p className={styles.footerP}>LOG IN</p>
            <button
              type="button"
              onClick={() => {
                // localStorage.removeItem("signUpForm");
                // wantToSignUp(false);
                extension.openLoginPage();
              }}
            >
              <img src={arrowBtnSignUp} className={styles.arrow} alt="Arrow" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SignUp;
