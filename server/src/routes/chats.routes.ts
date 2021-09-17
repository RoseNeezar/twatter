import express from "express";
import {
  createChat,
  getChatDetailsByChatId,
  getChatMessagesByChatId,
  getUsersChat,
  markReadMessageInChatByChatId,
  updateChatNameByChatId,
} from "../controller/chats.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";

const ChatsRoute = express.Router();

ChatsRoute.route("/")
  .post(currentUser, requireAuth, createChat)
  .get(currentUser, requireAuth, getUsersChat);

ChatsRoute.route("/:chatId")
  .get(currentUser, requireAuth, getChatDetailsByChatId)
  .put(currentUser, requireAuth, updateChatNameByChatId);

ChatsRoute.route("/:chatId/messages").get(
  currentUser,
  requireAuth,
  getChatMessagesByChatId
);
ChatsRoute.route("/:chatId/messages/markAsRead").put(
  currentUser,
  requireAuth,
  markReadMessageInChatByChatId
);

export default ChatsRoute;
