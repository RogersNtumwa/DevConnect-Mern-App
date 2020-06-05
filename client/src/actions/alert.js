import { SET_ALERTS, REMOVE_ALERTS } from "./types";
import { v4 as uuid } from "uuid";

export const setAlert = (msg, alertType, timeout = 3000) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERTS,
    payload: { msg, alertType, id },
  });
  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERTS,
        payload: id,
      }),
    timeout
  );
};
