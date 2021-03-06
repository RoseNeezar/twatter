import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../auth/types/auth.model";
import {
  IChat,
  IGetMessages,
  IMessage,
  IMessageContent,
} from "./types/chats.types";

export interface chatsState {
  chatChannels: IChat[] | null;
  chatChannelDetail: IChat | null;
  chatChannelMessages: IMessage | null;
  socket: SocketIOClient.Socket | null;
  socketConnected: boolean;
  isTyping: boolean;
  unreadChat: IChat[] | null;
}

const initialState: chatsState = {
  chatChannels: null,
  chatChannelDetail: null,
  chatChannelMessages: null,
  socket: null,
  socketConnected: false,
  isTyping: false,
  unreadChat: null,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    createChat: (state, action: PayloadAction<IUser[]>) => state,
    getUserChat: (state, action: PayloadAction<{ unreadOnly: boolean }>) =>
      state,
    getUserChatSuccess: (state, action: PayloadAction<IChat[]>) => {
      state.chatChannels = action.payload;
    },
    getChatDetails: (state, action: PayloadAction<string>) => state,
    getChatDetailsSuccess: (state, action: PayloadAction<IChat>) => {
      state.chatChannelDetail = action.payload;
    },
    getPaginatedMessages: (state, action: PayloadAction<IGetMessages>) => state,
    getPaginatedMessagesSuccess: (state, action: PayloadAction<IMessage>) => {
      if (action.payload.messages.length > 0) {
        state.chatChannelMessages?.messages.unshift(...action.payload.messages);
      }

      if (action.payload.pagination && state.chatChannelMessages?.pagination) {
        state.chatChannelMessages.pagination = action.payload.pagination;
      }
    },
    getChatMessagesSuccess: (state, action: PayloadAction<IMessage>) => {
      state.chatChannelMessages = action.payload;
    },
    sendMessage: (
      state,
      action: PayloadAction<{ content: string; chatId: string }>
    ) => state,
    sendMessageSuccess: (state, action: PayloadAction<IMessageContent>) => {
      state.chatChannelMessages?.messages.push(action.payload);

      if (
        state.chatChannels?.findIndex(
          (re) => re.id === action.payload.chat.id
        ) !== -1
      ) {
        state.chatChannels!.find(
          (re) => re.id === action.payload.chat.id
        )!.latestMessage = action.payload;
      }
    },
    setSocket: (state, action: PayloadAction<SocketIOClient.Socket>) => {
      state.socket = action.payload;
    },
    setSocketLoaded: (state) => {
      console.log("setSocketLoaded");
      state.socketConnected = true;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    refreshMessageBadgeChat: (
      state,
      action: PayloadAction<{ unreadOnly: boolean }>
    ) => state,
    refreshMessageBadgeChatSuccess: (state, action: PayloadAction<IChat[]>) => {
      state.unreadChat = action.payload;
    },
    markMessageRead: (state, action: PayloadAction<string>) => state,
    resetChannel: (state) => {
      state.chatChannelDetail = null;
    },
  },
});

export const {
  createChat,
  getUserChat,
  getUserChatSuccess,
  getChatDetails,
  getChatDetailsSuccess,
  sendMessage,
  sendMessageSuccess,
  getPaginatedMessages,
  getChatMessagesSuccess,
  setSocket,
  setSocketLoaded,
  setIsTyping,
  refreshMessageBadgeChat,
  refreshMessageBadgeChatSuccess,
  markMessageRead,
  resetChannel,
  getPaginatedMessagesSuccess,
} = chatsSlice.actions;

export default chatsSlice.reducer;
