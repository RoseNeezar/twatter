import { Dispatch, useEffect } from "react";
import socketClient from "socket.io-client";
import { IUser } from "../module/auth/types/auth.model";
import {
  getUserChat,
  refreshMessageBadgeChat,
  sendMessageSuccess,
  setIsTyping,
  setSocket,
  setSocketLoaded,
} from "../module/chats/chats.slice";
import { IMessage } from "../module/chats/types/chats.types";

const useSocket = (user: IUser, dispatch: Dispatch<any>) => {
  useEffect(() => {
    const socket = socketClient.connect("http://localhost:3030", {
      path: "/api/socket.io",
    });

    dispatch(setSocket(socket));

    socket.emit("setup", user);

    dispatch(
      refreshMessageBadgeChat({
        unreadOnly: true,
      })
    );

    socket.on("connected", () => {
      dispatch(setSocketLoaded());
    });

    socket.on("typing", () => {
      dispatch(setIsTyping(true));
    });

    socket.on("stop-typing", () => {
      dispatch(setIsTyping(false));
    });

    socket.on("channel-created", () => {
      dispatch(
        getUserChat({
          unreadOnly: false,
        })
      );
    });

    socket.on("message-received", (message: IMessage) => {
      dispatch(sendMessageSuccess(message));
      dispatch(
        refreshMessageBadgeChat({
          unreadOnly: true,
        })
      );
    });

    socket.on("error", (err: any) => {
      console.log("socket-clients", err);
    });
  }, []);
};

export default useSocket;
