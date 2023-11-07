import React, { useEffect } from "react";
import styles from "../styles/TypeWriter.module.css";
import Typewriter from "typewriter-effect";

export function WriteName({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepOne = true;
    setSteps({ ...steps });
  };

  useEffect(() => {
    let isStep1 = localStorage.getItem("step1");
    if (isStep1) {
      steps.stepOne = true;
      setSteps({ ...steps });
    }
  }, []);

  return (
    <div className={styles.container}>
      <span id="txt-type">
        {steps.stepOne ? "Who's the legend joining us?" : ""}
        {!steps.stepOne && (
          <Typewriter
            onInit={(typewriter) => {
              localStorage.setItem("step1", true);
              typewriter
                .typeString("Who's the legend jon")
                .pauseFor(200)
                .deleteChars(2)
                .typeString("oining us?")
                .start()
                .callFunction(completeStep);
            }}
            options={{
              delay: 100,
            }}
          />
        )}
      </span>
    </div>
  );
}
export function WriteEmail({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepTwo = true;
    setSteps({ ...steps });
  };

  useEffect(() => {
    let isStepTwo = localStorage.getItem("step2");
    if (isStepTwo) {
      steps.stepTwo = true;
      setSteps({ ...steps });
    }
  }, []);

  if (steps.stepTwo) {
    return <>Legend's inbox, please?</>;
  } else {
    return <>Legend's inbox, please?</>;
    // return (
    //   <Typewriter
    //     onInit={(typewriter) => {
    //       localStorage.setItem("step2", true);
    //       typewriter
    //         .typeString("Legend's inbox, please")
    //         .pauseFor(500)
    //         .typeString("?")
    //         .start()
    //         .callFunction(completeStep);
    //     }}
    //     options={{
    //       delay: 100,
    //     }}
    //   />
    // );
  }
}
export function WritePassword({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepThree = true;
    setSteps({ ...steps });
  };

  useEffect(() => {
    let isStepThree = localStorage.getItem("step3");
    if (isStepThree) {
      steps.stepThree = true;
      setSteps({ ...steps });
    }
  }, []);

  if (steps.stepThree) {
    return <>Craft your Password</>;
  } else {
    return <>Craft your Password</>;
    // return (
    //   <Typewriter
    //     onInit={(typewriter) => {
    //       localStorage.setItem("step3", true);
    //       typewriter
    //         .typeString("Craft your  Pass")
    //         .deleteChars(6)
    //         .pauseFor(200)
    //         .typeString(" Password")
    //         .start()
    //         .callFunction(completeStep);
    //     }}
    //     options={{
    //       delay: 100,
    //     }}
    //   />
    // );
  }
}

export function WhatIsBeatific({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepFour = true;
    setSteps({ ...steps });
  };
  if (steps.stepFour) {
    return <>What is Beatific</>;
  } else {
    return (
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("What is Beatific")
            .pauseFor(600)
            .typeString("...")
            .start()
            .callFunction(completeStep);
        }}
        options={{
          delay: 100,
        }}
      />
    );
  }
}
