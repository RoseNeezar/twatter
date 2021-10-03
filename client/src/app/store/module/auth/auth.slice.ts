import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { RootState } from "../../store";
import { followUserFullfilled } from "../user/user.slice";
import { IError, ILogin, IRegister, IUser } from "./types/auth.model";

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
      if (!!action.payload?.errors && action.payload?.errors.length > 0) {
        if (
          action.payload.errors[0].message === "not authenticated" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/";
        }
        action.payload.errors.map((err) => {
          toast.error(err.message);
        });
      }
    },
    setAppLoaded: (state) => {
      console.log("setAppLoaded");
      state.appLoaded = true;
    },
    logout: () => {},
    resetUser: (state) => {
      state.user = null;
    },
    routeChange: (state, action: PayloadAction<Location>) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(followUserFullfilled, (state, action) => {
      state.user = action.payload;
    });
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
  routeChange,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const isLoggedIn = (state: RootState) => !!state.auth.user;
