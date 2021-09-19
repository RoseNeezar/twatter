import queryString from "query-string";
import { ajax } from "rxjs/ajax";
import {
  ILogin,
  IRegister,
  IUser,
} from "../store/module/auth/types/auth.model";
import { IChat, IMessage } from "../store/module/chats/types/chats.types";
import {
  ICreatePost,
  IFetchPost,
  IGetReplyPost,
  IPost,
} from "../store/module/post/types/post.types";
import { IUserProfile } from "../store/module/user/types/user.model";

const baseURL = "http://localhost:3030/api/";

const requestRxjs = {
  get: <T>(url: string) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "GET",
      withCredentials: true,
    }),
  post: <T>(url: string, body?: {}) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "POST",
      withCredentials: true,
      body,
    }),
  put: <T>(url: string, body?: {}) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "PUT",
      withCredentials: true,
      body,
    }),
  del: <T>(url: string) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "DELETE",
      withCredentials: true,
    }),
};

const AuthService = {
  login: (data: ILogin) =>
    requestRxjs.post<IUser>(
      queryString.stringifyUrl({ url: "auth/login" }),
      data
    ),
  register: (data: IRegister) =>
    requestRxjs.post<IUser>(
      queryString.stringifyUrl({ url: "auth/signup" }),
      data
    ),
  logout: () =>
    requestRxjs.post(queryString.stringifyUrl({ url: "auth/logout" })),
  currentUser: () =>
    requestRxjs.get<IUser>(
      queryString.stringifyUrl({ url: "auth/current-user" })
    ),
};

const PostService = {
  createPost: (data: ICreatePost) =>
    requestRxjs.post<IPost>(queryString.stringifyUrl({ url: "posts" }), data),
  fetchPost: (data?: Partial<IFetchPost>) =>
    requestRxjs.get<IPost[]>(
      queryString.stringifyUrl({ url: "posts", query: data })
    ),
  likePost: (id: string) =>
    requestRxjs.put<IPost>(
      queryString.stringifyUrl({ url: `posts/${id}/like` })
    ),
  retweetPost: (id: string) =>
    requestRxjs.post<IPost>(
      queryString.stringifyUrl({ url: `posts/${id}/retweet` })
    ),
  getPostById: (id: string) =>
    requestRxjs.get<IGetReplyPost>(
      queryString.stringifyUrl({ url: `posts/${id}` })
    ),
  deletePostById: (id: string) =>
    requestRxjs.del<IGetReplyPost>(
      queryString.stringifyUrl({ url: `posts/${id}` })
    ),
  pinnedPostById: (id: string, data: { pinned: boolean }) =>
    requestRxjs.put<void>(
      queryString.stringifyUrl({ url: `posts/${id}` }),
      data
    ),
};

const UserService = {
  getUserByUsername: (data: string) =>
    requestRxjs.get<IUser>(queryString.stringifyUrl({ url: `users/${data}` })),
  followUser: (data: string) =>
    requestRxjs.put<IUser>(
      queryString.stringifyUrl({ url: `users/${data}/follow` })
    ),
  getUsersFollower: (data: string) =>
    requestRxjs.get<IUserProfile>(
      queryString.stringifyUrl({ url: `users/${data}/followers` })
    ),
  getUsersFollowing: (data: string) =>
    requestRxjs.get<IUserProfile>(
      queryString.stringifyUrl({ url: `users/${data}/following` })
    ),
  searchUser: (data: { search: string }) =>
    requestRxjs.get<IUser[]>(
      queryString.stringifyUrl({ url: "users", query: data })
    ),
};

const ChatService = {
  createChat: (data: IUser[]) =>
    requestRxjs.post<IChat>(queryString.stringifyUrl({ url: "chats" }), {
      users: data,
    }),
  fetchUserChat: (data: { unreadOnly: boolean }) =>
    requestRxjs.get<IChat[]>(
      queryString.stringifyUrl({ url: "chats", query: data })
    ),
  getChatDetailsByChatId: (data: string) =>
    requestRxjs.get<IChat>(queryString.stringifyUrl({ url: `chats/${data}` })),
  updateChatTitleByChatId: (data: { id: string; title: string }) =>
    requestRxjs.put<IChat>(
      queryString.stringifyUrl({ url: `chats/${data.id}` }),
      {
        chatName: data.title,
      }
    ),
};

const MessageService = {
  sendMessage: (data: { content: string; chatId: string }) =>
    requestRxjs.post<IMessage>(queryString.stringifyUrl({ url: "message" }), {
      content: data.content,
      chatId: data.chatId,
    }),
  getChatMessagesChatId: (data: string) =>
    requestRxjs.get<IMessage[]>(
      queryString.stringifyUrl({ url: `chats/${data}/messages` })
    ),
  markReadChatMessagesChatId: (data: string) =>
    requestRxjs.put<void>(
      queryString.stringifyUrl({ url: `chats/${data}/messages/markAsRead` })
    ),
};

const agent = {
  AuthService,
  PostService,
  UserService,
  ChatService,
  MessageService,
};

export default agent;
