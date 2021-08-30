import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  ICreatePost,
  IFetchPost,
  IGetReplyPost,
  IPost,
} from "./types/post.types";

export interface postState {
  post: IPost[] | null;
  replyPost: IGetReplyPost | null;
}

const initialState: postState = {
  post: null,
  replyPost: null,
};

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    createPost: (state, action: PayloadAction<ICreatePost>) => state,
    fetchPost: (state, action: PayloadAction<Partial<IFetchPost>>) => state,
    setPost: (state, action: PayloadAction<IPost>) => {
      state.post?.unshift(action.payload);
    },
    setFetchPost: (state, action: PayloadAction<IPost[]>) => {
      state.post = action.payload;
    },
    likePost: (state, action: PayloadAction<string>) => state,
    likePostFulfilled: (state, action: PayloadAction<IPost>) => {
      state.post?.map((post) => {
        if (post.id === action.payload.id) {
          post.likes = action.payload.likes;
        }
        return post;
      });
    },
    retweetPost: (state, action: PayloadAction<string>) => state,
    retweetPostFulfilled: (state, action: PayloadAction<IPost>) => state,
    getReplyPost: (state, action: PayloadAction<string>) => state,
    getReplyPostFulfilled: (state, action: PayloadAction<IGetReplyPost>) => {
      state.replyPost = action.payload;
    },
    replyToPost: (state, action: PayloadAction<ICreatePost>) => state,
    replyToPostFullfilled: (state, action: PayloadAction<IPost>) => state,
  },
});

export const {
  createPost,
  setPost,
  fetchPost,
  setFetchPost,
  likePost,
  likePostFulfilled,
  retweetPost,
  retweetPostFulfilled,
  getReplyPost,
  getReplyPostFulfilled,
  replyToPost,
  replyToPostFullfilled,
} = postSlice.actions;

export default postSlice.reducer;

export const getPosts = (state: RootState) => state.posts.post;
