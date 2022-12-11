const { REACT_APP_SERVER_URL, REACT_APP_STRIPE_SECRET } = process.env;

module.exports = {
  serverUrl: REACT_APP_SERVER_URL || "http://localhost:5000",
  stripeSecret: REACT_APP_STRIPE_SECRET,
};
