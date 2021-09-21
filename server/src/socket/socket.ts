import socketIo from "socket.io";
import http from "http";
import { User, UserDoc } from "../models/user.models";
import { Request, Response } from "express";
import { MessageDoc } from "../models/message.models";
import { ChatDoc } from "../models/chat.models";

export const socketServer = (server: http.Server) => {
  const io = socketIo(server, {
    path: "/api/socket.io",
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    socket.on("setup", (userData: UserDoc) => {
      socket.join(userData.id);
      socket.emit("connected");
    });
    socket.on("join-room", (channelId: string) => {
      socket.join(channelId);
    });
    socket.on("typing", (channelId: string) => {
      socket.in(channelId).emit("typing");
    });
    socket.on("stop-typing", (channelId: string) => {
      socket.in(channelId).emit("stop-typing");
    });
    socket.on("new-message", (newMessage: MessageDoc) => {
      const chat = newMessage.chat as ChatDoc;
      const channelusers = chat.users as UserDoc[];
      if (!channelusers) return;
      channelusers.forEach((user) => {
        const chatters = user as UserDoc;
        const sender = newMessage.sender as UserDoc;
        if (chatters.id === sender.id) return;
        socket.in(chatters.id).emit("message-received", newMessage);
      });
    });
    socket.on(
      "new-channel",
      (data: { userIds: string[]; currentUserId: string }) => {
        if (!data.userIds) return;
        data.userIds.forEach((user) => {
          if (user === data.currentUserId) return;
          socket.in(user).emit("channel-created");
        });
      }
    );

    socket.on("error", function (err) {
      console.log("socket-err", err);
    });
  });
};

const getAllUsers = async () => {
  return User.find({}).then((user) => {
    return user.map((re) => re.id);
  });
};
