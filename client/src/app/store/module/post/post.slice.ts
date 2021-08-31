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
        if (post.retweetData && post.retweetData.id === action.payload.id) {
          post.retweetData.likes = action.payload.likes;
        }
        return post;
      });
      if (state.replyPost) {
        if (state.replyPost.postData.id === action.payload.id) {
          state.replyPost.postData.likes = action.payload.likes;
        }
        if (
          state.replyPost.postData.retweetData &&
          state.replyPost.postData.retweetData.id === action.payload.id
        ) {
          state.replyPost.postData.retweetData.likes = action.payload.likes;
        }
      }
      if (state.replyPost?.replies) {
        const checker = state.replyPost.replies.findIndex(
          (re) => re.id === action.payload.id
        );
        if (checker !== -1) {
          state.replyPost.replies.splice(checker, 1, action.payload);
        }
      }
    },
    retweetPost: (state, action: PayloadAction<string>) => state,
    retweetPostFulfilled: (state, action: PayloadAction<IPost>) => {
      if (state.replyPost) {
        if (state.replyPost.postData.id === action.payload.id) {
          state.replyPost.postData.retweetUsers = action.payload.retweetUsers;
        }
        if (
          state.replyPost.postData.retweetData &&
          state.replyPost.postData.retweetData.id === action.payload.id
        ) {
          state.replyPost.postData.retweetData.retweetUsers =
            action.payload.retweetUsers;
        }
      }
      if (state.replyPost?.replies) {
        const checker = state.replyPost.replies.findIndex(
          (re) => re.id === action.payload.id
        );
        if (checker !== -1) {
          state.replyPost.replies.splice(checker, 1, action.payload);
        }
      }
    },
    getReplyPost: (state, action: PayloadAction<string>) => state,
    getReplyPostFulfilled: (state, action: PayloadAction<IGetReplyPost>) => {
      state.replyPost = action.payload;
    },
    replyToPost: (state, action: PayloadAction<ICreatePost>) => state,
    replyToPostFullfilled: (state, action: PayloadAction<IPost>) => state,
    replyToSinglePost: (state, action: PayloadAction<ICreatePost>) => state,
    replyToSinglePostFullfilled: (state, action: PayloadAction<IPost>) => state,
    updateSinglePost: (state, action: PayloadAction<string>) => state,
    deletePost: (
      state,
      action: PayloadAction<{ id: string; replyTo?: string }>
    ) => state,
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
  replyToSinglePost,
  replyToSinglePostFullfilled,
  updateSinglePost,
  deletePost,
} = postSlice.actions;

export default postSlice.reducer;

export const getPosts = (state: RootState) => state.posts.post;
