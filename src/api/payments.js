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
  renewSubscription: (data) => {
    return new Promise(async (resolve) => {
      const headers = {
        Authorization: `Bearer ${data.token}`,
      };
      const email = data.email;

      const result = await axios.get(
        config.serverUrl + "/api/v1/stripe/renew-subscription?email=" + email,
        { headers }
      );
      resolve(result.data);

    });
  },
};
export default payments;
