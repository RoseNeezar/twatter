import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../auth/types/auth.model";
import { IChat } from "./types/chats.types";

export interface chatsState {
  chatChannels: IChat[] | null;
  chatChannelDetail: IChat | null;
}

const initialState: chatsState = {
  chatChannels: null,
  chatChannelDetail: null,
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
  },
});

export const {
  createChat,
  getUserChat,
  getUserChatSuccess,
  getChatDetails,
  getChatDetailsSuccess,
} = chatsSlice.actions;

export default chatsSlice.reducer;
