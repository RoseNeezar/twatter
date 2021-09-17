import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../auth/types/auth.model";
import { IChat, IMessage } from "./types/chats.types";

export interface chatsState {
  chatChannels: IChat[] | null;
  chatChannelDetail: IChat | null;
  chatChannelMessages: IMessage[] | null;
}

const initialState: chatsState = {
  chatChannels: null,
  chatChannelDetail: null,
  chatChannelMessages: null,
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
    getChatMessages: (state, action: PayloadAction<string>) => state,
    getChatMessagesSuccess: (state, action: PayloadAction<IMessage[]>) => {
      state.chatChannelMessages = action.payload;
    },
    sendMessage: (
      state,
      action: PayloadAction<{ content: string; chatId: string }>
    ) => state,
    sendMessageSuccess: (state, action: PayloadAction<IMessage>) => {
      state.chatChannelMessages?.push(action.payload);
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
  getChatMessages,
  getChatMessagesSuccess,
} = chatsSlice.actions;

export default chatsSlice.reducer;
