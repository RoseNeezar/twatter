import axios, { AxiosResponse } from "axios";
import { ajax } from "rxjs/ajax";
import {
  ILogin,
  IRegister,
  IUser,
} from "../store/module/auth/types/auth.model";
import {
  ICreatePost,
  IFetchPost,
  IGetReplyPost,
  IPost,
} from "../store/module/post/types/post.types";
import { IUserProfile } from "../store/module/user/types/user.model";
import queryString from "query-string";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const baseURL = "http://localhost:3030/api/";

const requests = {
  get: <T>(url: string, data?: any) =>
    axios
      .get<T>(url, {
        withCredentials: true,
        params: data,
      })
      .then(responseBody),
  post: <T>(url: string, body?: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body?: {}, params?: any) =>
    axios
      .put<T>(url, body, {
        params,
      })
      .then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

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
  login: (data: ILogin) => requests.post<IUser>("auth/login", data),
  register: (data: IRegister) => requests.post<IUser>("auth/signup", data),
  logout: () => requests.post("auth/logout"),
  currentUser: () => requests.get<IUser>("auth/current-user"),
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
};

const UserService = {
  getUserByUsername: (data: string) => requests.get<IUser>(`users/${data}`),
  followUser: (data: string) => requests.put<IUser>(`users/${data}/follow`),
  getUsersFollower: (data: string) =>
    requests.get<IUserProfile>(`users/${data}/followers`),
  getUsersFollowing: (data: string) =>
    requests.get<IUserProfile>(`users/${data}/following`),
};

const agent = {
  AuthService,
  PostService,
  UserService,
};

export default agent;
