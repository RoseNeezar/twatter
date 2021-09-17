import { Chat } from "../models/chat.models";
import { Message } from "../models/message.models";
import { RequestTyped } from "../types/types";
import mongoose from "mongoose";
import { Response } from "express";
import { User } from "../models/user.models";
import { BadRequestError } from "../errors/bad-request-error";

export const sendMessage = async (
  req: RequestTyped<{ content: string; chatId: string }, {}, {}>,
  res: Response
) => {
  if (!req.body.content || !req.body.chatId) {
    console.log("Invalid data passed into request");
    throw new BadRequestError("no chat with id");
  }

  const newMessage = {
    sender: mongoose.Types.ObjectId(req.currentUser?.id),
    content: req.body.content,
    chat: req.body.chatId,
  };

  Message.create(newMessage)
    .then(async (message) => {
      message = await message.populate("sender").execPopulate();
      message = await message.populate("chat").execPopulate();
      message = await User.populate(message, { path: "chat.users" });

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      }).catch((error) => {
        console.log(error);
        throw new BadRequestError("no chat with id");
      });

      res.status(201).send(message);
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no chat with id");
    });
};
