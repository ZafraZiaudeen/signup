const initialState = {
  errorMessage: {
    text: "",
    negative: false,
  },
  couponOpen: false,
  couponData: null,
  clientData: {},
  loading: false,
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
    case "SET_COUPON_DATA":
      return {
        ...state,
        couponData: action.payload,
      };
    case "SET_CLIENT_DATA":
      return {
        ...state,
        clientData: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state;
  }
};

export default commonReducer;
