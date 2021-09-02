import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../auth/types/auth.model";

export interface userState {
  currentUserProfile: IUser | null;
}

const initialState: userState = {
  currentUserProfile: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<IUser>) => {
      state.currentUserProfile = action.payload;
    },
    getUserProfile: (state, action: PayloadAction<string>) => state,
  },
});

export const { setUserProfile, getUserProfile } = userSlice.actions;

export default userSlice.reducer;
