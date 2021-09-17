import express from "express";
import { sendMessage } from "../controller/message.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";

const MessageRoute = express.Router();

MessageRoute.route("/").post(currentUser, requireAuth, sendMessage);

export default MessageRoute;
