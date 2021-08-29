import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user.models";
import jwt from "jsonwebtoken";
import { UserPayload } from "../dto/auth.dto";
import { Password } from "../services/password";

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
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_SECRET!
  );

  req.session = {
    jwt: userJwt,
  };

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

    const user = User.build({ email, password, firstName, lastName, username });

    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  } catch (error) {
    throw new BadRequestError(`Error - ${error}`);
  }
};

export const logout = (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

export const getCurrentUser = (req: Request, res: Response) => {
  res.send(req.currentUser || null);
};
