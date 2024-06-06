const initialState = {
  errorMessage: {
    text: "",
    negative: false,
  },
  couponOpen: false,
  couponData: null,
  clientData: {},
  fromSession: false,
  loading: false,
  selectedSubscription: null,
  settings: null,
  verificationPopup: false
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: { ...state.errorMessage, ...action.payload },
      };
    case "TOGGLE_COUPON":
      if (action.payload === false) {
        return { ...state, couponOpen: false }
      }
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
    case "SET_FROM_SESSION":
      return {
        ...state,
        fromSession: action.payload,
      };
    case "SET_SELECTED_SUBSCRIPTION":
      return {
        ...state,
        selectedSubscription: action.payload,
      }
    case "SET_SETTINGS":
      return {
        ...state,
        settings: action.payload,
      }
    case "SET_VERIFICATION_POPUP":
      return {
        ...state,
        verificationPopup: action.payload
      }
    default:
      return state;
  }
};

export default commonReducer;
