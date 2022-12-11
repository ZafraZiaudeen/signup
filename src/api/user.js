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
};

export default user;
