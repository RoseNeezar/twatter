import { PostAttrs } from "../models/post.models";

interface IPost extends PostAttrs {}

export type ICreatePost = Pick<IPost, "content" | "replyTo">;

export interface IGetPostQuery {
  isReply: boolean;
  replyTo: any;
  search: string;
  content: any;
  followingOnly: boolean;
  postedBy: any;
}

export type IPinnedPost = IPost;
