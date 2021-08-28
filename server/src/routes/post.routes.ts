import express from "express";

const PostRoute = express.Router();

PostRoute.route("/").get().post();
PostRoute.route("/:id").get().delete().put();
PostRoute.route("/:id/like").put();
PostRoute.route("/:id/retweet").post();

export default PostRoute;
