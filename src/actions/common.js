export const updateErrorMessage = (data) => {
  return {
    type: "UPDATE_ERROR_MESSAGE",
    payload: data,
  };
};
export const toggleCoupon = () => {
  return {
    type: "TOGGLE_COUPON",
  };
};
