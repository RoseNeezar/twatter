import { Response } from "express";

export const sendCookieToken = (
  res: Response,
  token: {
    refreshToken: string;
    accessToken: string;
  }
) => {
  res.cookie("refreshToken", token.refreshToken, {
    httpOnly: true,
    path: "/",
  });
  res.cookie("accessToken", token.accessToken, {
    httpOnly: true,
    path: "/",
  });
};
