import axios from "axios";
import config from "../config/config";

const user = {
  updateStripeCustomer: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.post(
        config.serverUrl + "/api/v1/users/paymentSuccess",
        data
      );
      resolve(result);
    }),
  checkIfSubscribed: (data) =>
    new Promise(async (resolve) => {
      let result = await axios.get(
        config.serverUrl +
          "/api/v1/subscribed/" +
          data.email +
          "/" +
          new Date().getMonth(),
        data
      );
      resolve(result);
    }),
  activateUserByEmail: (data) =>
    new Promise((resolve) => {
      axios
        .post(config.serverUrl + "/api/v1/users/activate", data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          resolve(err);
        });
    }),
  getUserByEmail: (data) =>
    new Promise((resolve) => {
      axios
        .post(config.serverUrl + "/api/v1/users/get-user", data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          resolve(err);
        });
    }),
};

export default user;
