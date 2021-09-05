import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../auth/types/auth.model";
import { ICreatePost, IFetchPost, IPost } from "../post/types/post.types";
import { IUserProfile } from "./types/user.model";

export interface userState {
  currentUserProfile: IUser | null;
  profilePost: IPost[] | null;
  userProfileFollows: IUserProfile | null;
  path: string | undefined;
}

const initialState: userState = {
  currentUserProfile: null,
  profilePost: null,
  userProfileFollows: null,
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
    getUserProfileFollowers: (state, action: PayloadAction<string>) => state,
    getUserProfileFollowing: (state, action: PayloadAction<string>) => state,
    getfollowUserFullfilled: (state, action: PayloadAction<IUserProfile>) => {
      state.userProfileFollows = action.payload;
    },
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
  getUserProfileFollowers,
  getUserProfileFollowing,
  getfollowUserFullfilled,
} = userSlice.actions;

export default userSlice.reducer;
