import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Navigate from "../../utils/Navigate";
import { RootState } from "../store";
import { IError, ILogin, IRegister, IUser } from "../types/auth.model";

export interface authState {
  user: IUser | null;
  isLoggedIn: boolean;
  appLoaded: boolean;
}

const initialState: authState = {
  user: null,
  isLoggedIn: false,
  appLoaded: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILogin>) => state,
    register: (state, action: PayloadAction<IRegister>) => state,
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    getUser: (state) => state,
    errorCatcher: (state, action: PayloadAction<IError>) => {
      console.log(action.payload);
      if (!!action.payload.errors && action.payload.errors.length > 0) {
        action.payload.errors.map((err) => {
          toast.error(err.message);
        });
      }
    },
    setAppLoaded: (state) => {
      state.appLoaded = true;
    },
    logout: () => {},
    resetUser: (state) => {
      state.user = null;
    },
  },
});

export const {
  logout,
  resetUser,
  login,
  setUser,
  register,
  errorCatcher,
  setAppLoaded,
  getUser,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
