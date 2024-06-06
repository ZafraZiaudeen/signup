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
  downloadData: (email, token) => new Promise((resolve) => {
    axios.get(config.serverUrl + "/api/v1/users/download-data/" + email + "/" + token).then((res) => {
      resolve(res);
    }).catch((err) => {
      resolve({ success: false, status: 500, message: err.response.data.message });
    });
  }),
  getDropOffData: (token) => new Promise((resolve) => {
    axios.get(config.serverUrl + "/api/v1/users/drop-off-token/" + token).then((res) => {
      resolve(res);
    }).catch((err) => {
      resolve({ success: false, status: 500, message: err.response.data.message });
    });
  }),
  saveEmail: (data) => new Promise((resolve) => {
    axios.post(config.serverUrl + "/api/v1/users/save-drop-off", data).then((res) => {
      resolve(res);
    }).catch((err) => {
      resolve(err);
    });
  }),
  verifyEmailCode: (data) => new Promise((resolve) => {
    axios.post(config.serverUrl + "/api/v1/users/verify-email-code", data).then((res) => {
      resolve(res);
    }).catch((err) => {
      resolve(err);
    });
  }),
  sendVerificationCode: (data) => new Promise((resolve) => {
    axios.post(config.serverUrl + "/api/v1/users/send-confirm-email", data).then((res) => {
      resolve(res);
    }).catch((err) => {
      resolve(err);
    });
  }),
};

export default user;
