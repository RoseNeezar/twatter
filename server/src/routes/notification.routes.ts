import express from "express";
import { getAllNotification } from "../controller/notification.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";

const NotificationRoute = express.Router();

NotificationRoute.route("/").get(currentUser, requireAuth, getAllNotification);

export default NotificationRoute;
