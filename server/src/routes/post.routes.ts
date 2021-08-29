import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  likePost,
  pinnedPost,
} from "../controller/post.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";

const PostRoute = express.Router();

PostRoute.route("/")
  .get(currentUser, requireAuth, getPosts)
  .post(currentUser, requireAuth, createPost);
PostRoute.route("/:id")
  .get(currentUser, requireAuth, getPostById)
  .delete(currentUser, requireAuth, deletePost)
  .put(currentUser, requireAuth, pinnedPost);
PostRoute.route("/:id/like").put(currentUser, requireAuth, likePost);
PostRoute.route("/:id/retweet").post();

export default PostRoute;
