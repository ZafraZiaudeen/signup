import axios from "axios";
import config from "../config/config";

const pricingPlans = {
  getAllPlans: () =>
    new Promise(async (resolve) => {
      let result = await axios.get(config.serverUrl + "/pricingPlans");
      resolve(result);
    }),
};
export default pricingPlans;
