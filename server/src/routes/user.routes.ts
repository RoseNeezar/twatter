import express from "express";
import {
  followUser,
  getRecommendUsersToFollow,
  getUserByUsername,
  getUserFollowers,
  getUserFollowing,
  searchUser,
  updateProfileBanner,
  updateProfileImage,
} from "../controller/user.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";
import multer, { FileFilterCallback } from "multer";
import { makeId } from "../utils/helpers";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname)); // e.g. jh34gh2v4y + .png
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      callback(new Error("Not an image"));
    }
  },
});
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

UserRoute.route("/recommend/user").get(
  currentUser,
  requireAuth,
  getRecommendUsersToFollow
);

export default UserRoute;
