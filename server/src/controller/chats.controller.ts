import { Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { Chat, ChatAttrs } from "../models/chat.models";
import { MessageDoc } from "../models/message.models";
import { User, UserDoc } from "../models/user.models";
import { RequestTyped } from "../types/types";

export const createChat = async (
  req: RequestTyped<{ users: UserDoc[] }, {}, { id: string }>,
  res: Response
) => {
  if (!req.body.users) {
    console.log("Users param not sent with request");
    throw new BadRequestError("No user");
  }
  const sanitize = req.body.users.map((re) => {
    return {
      ...re,
      _id: re.id,
    };
  });
  const users = sanitize;

  if (users.length === 0) {
    console.log("Users array is empty");
    throw new BadRequestError("No user");
  }

  users.push(req.currentUser as any);

  const chatData = {
    users: users,
    isGroupChat: true,
  };

  Chat.create(chatData)
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("No user");
    });
};

export const getUsersChat = async (
  req: RequestTyped<{}, { unreadOnly: string }, {}>,
  res: Response
) => {
  Chat.find({ users: { $elemMatch: { $eq: req.currentUser?.id } } })
    .populate("users")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      if (!!req.query.unreadOnly && req.query.unreadOnly === "true") {
        results = results.filter((r) => {
          const newType = r.latestMessage as MessageDoc;
          return newType && !newType.readBy?.includes(req.currentUser?.id);
        });
      }

      results = await User.populate(results, { path: "latestMessage.sender" });
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("No user");
    });
};
