import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../auth/types/auth.model";

export interface userState {
  userProfile: IUser | null;
}

const initialState: userState = {
  userProfile: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<IUser>) => {
      state.userProfile = action.payload;
    },
    getUserProfile: (state, action: PayloadAction<string>) => state,
  },
});

export const { setUserProfile, getUserProfile } = userSlice.actions;

export default userSlice.reducer;
