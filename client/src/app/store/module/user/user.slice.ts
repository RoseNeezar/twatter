import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../auth/types/auth.model";
import { ICreatePost, IFetchPost, IPost } from "../post/types/post.types";

export interface userState {
  currentUserProfile: IUser | null;
  profilePost: IPost[] | null;
  path: string | undefined;
}

const initialState: userState = {
  currentUserProfile: null,
  profilePost: null,
  path: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<IUser>) => {
      state.currentUserProfile = action.payload;
    },
    getUserProfile: (state, action: PayloadAction<string>) => state,
    fetchProfilePost: (state, action: PayloadAction<Partial<IFetchPost>>) =>
      state,
    setProfilePost: (state, action: PayloadAction<IPost[]>) => {
      state.profilePost = action.payload;
    },
    replyToProfilePost: (state, action: PayloadAction<ICreatePost>) => {
      state.path = action.payload.path;
    },
    deleteProfilePost: (
      state,
      action: PayloadAction<{ id: string; replyTo?: string; path: string }>
    ) => {
      state.path = action.payload.path;
    },
    retweetProfilePost: (
      state,
      action: PayloadAction<{ id: string; path: string }>
    ) => {
      state.path = action.payload.path;
    },
    retweetProfilePostFulfilled: (state) => state,
    followUser: (state, action: PayloadAction<string>) => state,
    followUserFullfilled: (state, action: PayloadAction<IUser>) => state,
  },
});

export const {
  fetchProfilePost,
  setProfilePost,
  setUserProfile,
  getUserProfile,
  replyToProfilePost,
  deleteProfilePost,
  retweetProfilePost,
  retweetProfilePostFulfilled,
  followUser,
  followUserFullfilled,
} = userSlice.actions;

export default userSlice.reducer;
