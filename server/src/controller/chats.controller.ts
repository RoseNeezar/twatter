import { Response } from "express";
import mongoose from "mongoose";
import { BadRequestError } from "../errors/bad-request-error";
import { Chat } from "../models/chat.models";
import { Message, MessageDoc } from "../models/message.models";
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

  if (users.length === 1) {
    return Chat.findOneAndUpdate(
      {
        isGroupChat: false,
        users: {
          $size: 2,
          $all: [
            {
              $elemMatch: { $eq: mongoose.Types.ObjectId(req.currentUser?.id) },
            },
            { $elemMatch: { $eq: mongoose.Types.ObjectId(users[0].id) } },
          ],
        },
      },
      {
        $setOnInsert: {
          users: [req.currentUser as any, users[0]],
        },
      },
      {
        new: true,
        upsert: true,
      }
    )
      .then((result) => res.status(200).send(result))
      .catch((error) => {
        console.log(error);
        throw new BadRequestError("No user");
      });
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
          return newType && !newType.readBy?.includes(req.currentUser!.id);
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

export const getChatDetailsByChatId = async (
  req: RequestTyped<{}, {}, { chatId: string }>,
  res: Response
) => {
  Chat.findOne({
    _id: mongoose.Types.ObjectId(req.params.chatId),
    users: {
      $elemMatch: { $eq: mongoose.Types.ObjectId(req.currentUser?.id) },
    },
  })
    .populate("users")
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      throw new BadRequestError("No channel");
    });
};

export const updateChatNameByChatId = async (
  req: RequestTyped<{ chatName: string }, {}, { chatId: string }>,
  res: Response
) => {
  Chat.findByIdAndUpdate(req.params.chatId, req.body)
    .then((results) => res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("No channel");
    });
};

export const getChatMessagesByChatId = async (
  req: RequestTyped<{}, { chatId: string; page: string; limit: string }, {}>,
  res: Response
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  try {
    const msgCount = await Message.find({
      chat: req.query.chatId,
    }).countDocuments();

    const totalPages = Math.ceil(msgCount / limit);

    const messages = await Message.find({ chat: req.query.chatId })
      .populate("sender")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const orderMessage = messages.reverse();
    const emptyMsg = { messages: [] };
    if (page > totalPages) return res.status(200).send(emptyMsg);

    const result = {
      messages: orderMessage,
      pagination: {
        page,
        totalPages,
      },
    };
    res.status(200).send(result);
  } catch (error) {
    throw new BadRequestError("No messages");
  }
};

export const markReadMessageInChatByChatId = async (
  req: RequestTyped<{}, {}, { chatId: string }>,
  res: Response
) => {
  Message.updateMany(
    { chat: req.params.chatId },
    { $addToSet: { readBy: mongoose.Types.ObjectId(req.currentUser?.id) } }
  )
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("No messages");
    });
};
