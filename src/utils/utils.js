import ReactGA from "react-ga";
const trackingId = "G-3QHV5V4XDL";
ReactGA.initialize(trackingId);

export const createGAEvent = (category, action, label, value) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};
