import { REMOVE_ALERTS, SET_ALERTS } from "../actions/types";

const initialState = [];
const alert = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERTS:
      return [...state, payload];

    case REMOVE_ALERTS:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
};

export default alert;
