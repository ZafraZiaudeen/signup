import React from "react";
import styles from "../styles/TypeWriter.module.css";
import Typewriter from "typewriter-effect";

export function WriteName({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepOne = true;
    setSteps({ ...steps });
  };

  return (
    <div className={styles.container}>
      <span id="txt-type">
        {steps.stepOne ? "How shall I call you?" : ""}
        {!steps.stepOne && (
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString("How shall I cal y")
                .pauseFor(200)
                .deleteChars(2)
                .typeString("l you?")
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
  if (steps.stepTwo) {
    return <>What is your email?</>;
  } else {
    return (
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("What is your email")
            .pauseFor(500)
            .typeString("?")
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
export function WritePassword({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepThree = true;
    setSteps({ ...steps });
  };
  if (steps.stepThree) {
    return <>Create a password</>;
  } else {
    return (
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("Create  a pass")
            .deleteChars(6)
            .pauseFor(200)
            .typeString(" a password")
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
