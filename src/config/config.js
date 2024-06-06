const { REACT_APP_SERVER_URL, REACT_APP_STRIPE_SECRET, REACT_APP_ENV, REACT_APP_PRICE_ID, REACT_APP_DEV_PRICE } = process.env;

module.exports = {
  serverUrl: REACT_APP_SERVER_URL || "http://localhost:5000",
  stripeSecret: REACT_APP_STRIPE_SECRET,
  devMode: REACT_APP_ENV === "development",
  devPrice: REACT_APP_DEV_PRICE,
  devPriceId: REACT_APP_PRICE_ID,
};
