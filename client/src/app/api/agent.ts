import axios, { AxiosResponse } from "axios";
import {
  ILogin,
  IRegister,
  IUser,
} from "../store/module/auth/types/auth.model";
import {
  ICreatePost,
  IFetchPost,
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
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
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
  fetchPost: (data?: IFetchPost) => requests.get<IPost[]>("posts", data),
};

const agent = {
  AuthService,
  PostService,
};

export default agent;
