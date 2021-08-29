import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import { UserPayload } from "../dto/auth.dto";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user.models";
import { Password } from "../services/password";
import { createTokens } from "../utils/createTokens";
import { sendCookieToken } from "../utils/sendCookieToken";

export const login = async (
  req: Request<
    {},
    {},
    Pick<UserPayload, "email" | "username"> & { password: string }
  >,
  res: Response
) => {
  const { email, password, username } = req.body;
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }

  const passwordMatch = await Password.compare(existingUser.password, password);

  if (!passwordMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  sendCookieToken(res, createTokens(existingUser));

  res.status(201).send(existingUser);
};

export const signUp = async (
  req: Request<{}, {}, UserPayload & { password: string }>,
  res: Response
) => {
  const { email, password, firstName, lastName, username } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({
      email,
      password,
      firstName,
      lastName,
      username,
    });

    await user.save();

    sendCookieToken(res, createTokens(user));

    res.status(201).send(user);
  } catch (error) {
    throw new BadRequestError(`Error - ${error}`);
  }
};

export const logout = (req: Request, res: Response) => {
  sendCookieToken(res, { accessToken: "", refreshToken: "" });
  res.send({});
};

export const getCurrentUser = (req: Request, res: Response) => {
  res.send(req.currentUser || null);
};

export const revokeRefreshTokensForUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  await User.updateOne({ id: req.currentUser?.id }, { tokenVersion: 1 });
  return res.status(201).send(true);
};
