import { IUser } from "../../auth/types/auth.model";

export interface IChat {
  isGroupChat: boolean;
  users: string[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
  latestMessage: IMessageContent;
  id: string;
}

export interface IMessageContent {
  chat: IChat;
  content: string;
  createdAt: string;
  id: string;
  readBy: string[] | IUser[];
  sender: IUser;
  updatedAt: string;
}
interface Paginate {
  page: number;
  totalPages: number;
}
export interface IMessage {
  messages: IMessageContent[];
  pagination: Paginate;
}

export interface IGetMessages {
  chatId: string;
  page: number;
  limit: number;
}
