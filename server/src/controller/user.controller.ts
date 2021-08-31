import { Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user.models";
import { RequestTyped } from "../types/types";

export const getUserByUsername = async (
  req: RequestTyped<{}, {}, { username: string }>,
  res: Response
) => {
  const username = req.params.username;

  const user = await User.findOne({ username: username });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  res.status(200).send(user);
};
