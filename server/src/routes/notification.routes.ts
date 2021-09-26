import express from "express";
import {
  getAllNotification,
  getSingleLatestNotification,
  openAllNotification,
  openSingleNotification,
} from "../controller/notification.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";

const NotificationRoute = express.Router();

NotificationRoute.route("/").get(currentUser, requireAuth, getAllNotification);
NotificationRoute.route("/latest").get(
  currentUser,
  requireAuth,
  getSingleLatestNotification
);
NotificationRoute.route("/:id/markAsOpened").put(
  currentUser,
  requireAuth,
  openSingleNotification
);
NotificationRoute.route("/markAsOpened").put(
  currentUser,
  requireAuth,
  openAllNotification
);

export default NotificationRoute;
