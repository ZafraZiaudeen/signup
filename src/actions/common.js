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
export const setCouponData = (data) => {
  return {
    type: "SET_COUPON_DATA",
    payload: data,
  };
};
export const setLoadingState = (data) => {
  return {
    type: "SET_LOADING",
    payload: data
  }
}


