import axios, { AxiosResponse } from "axios";
import { ILogin, IRegister, IUser } from "../store/types/auth.model";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) =>
    axios
      .get<T>(url, {
        withCredentials: true,
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

const agent = {
  AuthService,
};

export default agent;
