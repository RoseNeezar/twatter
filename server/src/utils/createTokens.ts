import { sign } from "jsonwebtoken";
import { UserDoc } from "../models/user.models";

export type RefreshTokenData = {
  userId: string;
  tokenVersion?: number;
};

export type AccessTokenData = {
  userId: string;
};

export const createTokens = (
  user: UserDoc
): { refreshToken: string; accessToken: string } => {
  const refreshToken = sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "14d",
    }
  );
  const accessToken = sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15min",
    }
  );

  return { refreshToken, accessToken };
};
