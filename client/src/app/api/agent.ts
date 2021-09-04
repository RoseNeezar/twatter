import axios, { AxiosResponse } from "axios";
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

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

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

const AuthService = {
  login: (data: ILogin) => requests.post<IUser>("auth/login", data),
  register: (data: IRegister) => requests.post<IUser>("auth/signup", data),
  logout: () => requests.post("auth/logout"),
  currentUser: () => requests.get<IUser>("auth/current-user"),
};

const PostService = {
  createPost: (data: ICreatePost) => requests.post<IPost>("posts", data),
  fetchPost: (data?: Partial<IFetchPost>) =>
    requests.get<IPost[]>("posts", data),
  likePost: (id: string) => requests.put<IPost>(`posts/${id}/like`),
  retweetPost: (id: string) => requests.post<IPost>(`posts/${id}/retweet`),
  getPostById: (id: string) => requests.get<IGetReplyPost>(`posts/${id}`),
  deletePostById: (id: string) => requests.del<IGetReplyPost>(`posts/${id}`),
};

const UserService = {
  getUserByUsername: (data: string) => requests.get<IUser>(`users/${data}`),
  followUser: (data: string) => requests.put<IUser>(`users/${data}/follow`),
};

const agent = {
  AuthService,
  PostService,
  UserService,
};

export default agent;
