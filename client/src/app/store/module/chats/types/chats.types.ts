import { IUser } from "../../auth/types/auth.model";

export interface IChat {
  isGroupChat: boolean;
  users: string[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
  latestMessage: IMessage;
  id: string;
}

export interface IMessage {
  chat: IChat;
  content: string;
  createdAt: string;
  id: string;
  readBy: string[] | IUser[];
  sender: IUser;
  updatedAt: string;
}
