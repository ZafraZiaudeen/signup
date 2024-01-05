import ReactGA from "react-ga4";
const trackingId = "G-3QHV5V4XDL";
ReactGA.initialize(trackingId);

export const createGAEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
