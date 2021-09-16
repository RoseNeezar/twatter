import express from "express";
import { createChat, getUsersChat } from "../controller/chats.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";

const ChatsRoute = express.Router();

ChatsRoute.route("/")
  .post(currentUser, requireAuth, createChat)
  .get(currentUser, requireAuth, getUsersChat);

ChatsRoute.route("/:chatId")
  .get(currentUser, requireAuth)
  .put(currentUser, requireAuth);

ChatsRoute.route("/:chatId/messages").get(currentUser, requireAuth);
ChatsRoute.route("/:chatId/messages/markAsRead").put(currentUser, requireAuth);

export default ChatsRoute;
