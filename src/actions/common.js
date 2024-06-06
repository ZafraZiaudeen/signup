export const updateErrorMessage = (data) => {
  return {
    type: "UPDATE_ERROR_MESSAGE",
    payload: data,
  };
};
export const toggleCoupon = (data) => {
  return {
    type: "TOGGLE_COUPON",
    payload: data,
  };
};
export const setCouponData = (data) => {
  return {
    type: "SET_COUPON_DATA",
    payload: data,
  };
};
export const setClientData = (data) => {
  return {
    type: "SET_CLIENT_DATA",
    payload: data,
  };
}

export const setLoadingState = (data) => {
  return {
    type: "SET_LOADING",
    payload: data
  }
}

export const setFromSession = (data) => {
  return {
    type: "SET_FROM_SESSION",
    payload: data
  }
}
export const setSelectedSubscription = (data) => {
  return {
    type: "SET_SELECTED_SUBSCRIPTION",
    payload: data
  }
}

export const setSettings = (data) => {
  return {
    type: "SET_SETTINGS",
    payload: data
  }
}

export const setVerificationPopup = (data) => {
  return {
    type: "SET_VERIFICATION_POPUP",
    payload: data
  }
} 
