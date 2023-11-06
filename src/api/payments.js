import axios from "axios";
import config from "../config/config";

const payments = {
  createCustomer: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "/stripe/create-customer",
        data
      );
      resolve(result);
    }),
  createSubscription: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "/api/v1/stripe/create-sub-html",
        data
      );
      resolve(result);
    }),
  validateCoupon: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "/api/v1/stripe/validate-coupon",
        data
      );
      resolve(result);
    }),
};
export default payments;
