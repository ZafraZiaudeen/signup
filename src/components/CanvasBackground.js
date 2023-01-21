import React, { useEffect } from "react";
import styles from "../styles/canvasBackground.module.css";

export default function CanvasBackground() {
  const init = () => {
    let canvas = document.getElementById("canvasArea");
    let context = canvas.getContext("2d");

    let numCircles = 500;
    let maxRadius = 200;
    let minRadius = 3;
    let colors = [
      "#93C4D9",
      "#023A61",
      "#0F334F",
      "#051320",
      "#182936",
      "#032760",
      "#6C9295",
      "#027FB9",
      "#FFF",
      "#0948FF",
      "#2A76FC",
      "#77CBC2",
      "#E51CAA",
      "#FF619A",
      "#D900B3",
      "#151F37",
      "#3BAEEB",
      "#B80648",
      "#A6D7E0",
      "#E02114",
      "#EB3F3B",
      "#E98930",
      "#FBB734",
      "#3AC0B3",
      "#2AB0C5",
      "#237FB0",
      "#1E5EA8",
    ];
    let numColors = colors.length;

    // A3. CREATE circles.
    for (let n = 0; n < numCircles; n++) {
      // A4. RANDOM values for circle characteristics.
      let xPos = Math.random() * canvas.width;
      let yPos = Math.random() * canvas.height;
      let radius = minRadius + Math.random() * (maxRadius - minRadius);
      let colorIndex = Math.random() * (numColors - 1);
      colorIndex = Math.round(colorIndex);
      let color = colors[colorIndex];

      // A5. DRAW circle.
      drawCircle(context, xPos, yPos, radius, color);
    }
  };
  function drawCircle(context, xPos, yPos, radius, color) {
    //B1. PARAMETERS for shadow and angles.
    let startAngle = (Math.PI / 180) * 0;
    let endAngle = (Math.PI / 180) * 360;

    //B2. DRAW CIRCLE
    context.beginPath();
    context.arc(xPos, yPos, radius, startAngle, endAngle, false);
    context.fillStyle = color;
    context.fill();
    //   context.filter = "blur(5px)";
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className={styles.canvasContainer}
    >
      <canvas
        id="canvasArea"
        className={styles.canvasArea}
        style={{ filter: "contrast(1.43) brightness(0.5)" }}
        width="1920px"
        height="1920px"
      ></canvas>
      <div className={styles.filter}></div>
    </div>
  );
}
