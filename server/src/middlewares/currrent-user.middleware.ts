import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User, UserDoc } from "../models/user.models";
import { createTokens } from "../utils/createTokens";
import { sendCookieToken } from "../utils/sendCookieToken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDoc | null;
    }
  }
}
export interface UserTokenPayload {
  userId: string;
  tokenVersion: number;
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  if (typeof accessToken !== "string") {
    return res.status(401).json({ error: "not authenticated" });
  }

  try {
    const data = <UserTokenPayload>(
      verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string)
    );

    const user = await User.findById(data.userId);

    if (!!user) {
      req.currentUser = user;
      return next();
    }
  } catch {}

  const refreshToken = req.cookies.refreshToken;
  if (typeof refreshToken !== "string") {
    return res.status(401).json({ error: "not authenticated" });
  }

  let data;
  try {
    data = <UserTokenPayload>(
      verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string)
    );
  } catch {
    return res.status(401).json({ error: "not authenticated" });
  }

  const user = await User.findById(data.userId);
  // token has been invalidated or user deleted
  if (!user || user.tokenVersion !== 0) {
    return res.status(401).json({ error: "not authenticated" });
  }

  sendCookieToken(res, createTokens(user));

  req.currentUser = user;

  next();
};
