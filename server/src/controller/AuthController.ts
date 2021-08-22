import { Request, Response } from "express";

export const login = (_: Request, res: Response) => {
  res.status(201).send("Hello");
};
