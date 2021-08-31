import { NextRouter } from "next/dist/client/router";

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
  profilePic: string;
  coverPhoto: string;
  likes?: string[];
  retweets?: string[];
  following?: string[];
  followers?: string[];
  createdAt: Date;
}

export interface IError {
  errors: {
    message: string;
  }[];
  router?: NextRouter;
}
