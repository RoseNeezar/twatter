import express from "express";
import {
  followUser,
  getUserByUsername,
  getUserFollowers,
  getUserFollowing,
  searchUser,
  updateProfileBanner,
  updateProfileImage,
} from "../controller/user.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { upload } from "../middlewares/image.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";

const UserRoute = express.Router();

UserRoute.route("/").get(currentUser, requireAuth, searchUser);
UserRoute.route("/:username").get(currentUser, requireAuth, getUserByUsername);

UserRoute.route("/:userId/follow").put(currentUser, requireAuth, followUser);

UserRoute.route("/:userId/following").get(
  currentUser,
  requireAuth,
  getUserFollowing
);
UserRoute.route("/:userId/followers").get(
  currentUser,
  requireAuth,
  getUserFollowers
);

UserRoute.route("/profilePicture").post(
  currentUser,
  requireAuth,
  upload.single("croppedImage"),
  updateProfileImage
);

UserRoute.route("/coverPhoto").post(
  currentUser,
  requireAuth,
  upload.single("croppedImage"),
  updateProfileBanner
);

export default UserRoute;
