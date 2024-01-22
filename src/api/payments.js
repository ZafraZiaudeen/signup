import axios from "axios";
import config from "../config/config";

const payments = {
  createCustomer: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "payments/create-customer",
        data
      );
      resolve(result);
    }),
  createSubscription: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "payments/create-subscription-intent",
        data
      );
      resolve(result);
    }),
  validateCoupon: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "payments/validate-coupon",
        data
      );
      resolve(result);
    }),
};
export default payments;
