const initialState = {
  errorMessage: {
    text: "",
    negative: false,
  },
  couponOpen: false,
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: { ...state.errorMessage, ...action.payload },
      };
    case "TOGGLE_COUPON":
      return {
        ...state,
        couponOpen: !state.couponOpen,
      };

    default:
      return state;
  }
};

export default commonReducer;
