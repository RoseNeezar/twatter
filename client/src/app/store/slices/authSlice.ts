import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authState {
  user: any;
  isLoggedIn: boolean;
}

const initialState: authState = {
  user: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => state,
    register: (state, action: PayloadAction<any>) => state,
  },
});

export const { login, register } = authSlice.actions;

export default authSlice.reducer;
