import { AUTH } from '../constants/actionTypes';
import * as api from "../api/index.js";

export const signin = (formData, history) => async (dispatch) => {
  try {
    // Gets data from api
    const { data } = await api.signIn(formData);

    // Dispatches action of type <> and updates the reducer
    dispatch({ type: AUTH, data} );

    history.push("/");
  } catch (error) {
    console.log(error);
  }
}

export const signup = (formData, history) => async (dispatch) => {
  try {
    // Gets data from api
    const { data } = await api.signUp(formData);

    // Dispatches action of type <> and updates the reducer
    dispatch({ type: AUTH, data} );

    history.push("/");
  } catch (error) {
    console.log(error);
  }
}
