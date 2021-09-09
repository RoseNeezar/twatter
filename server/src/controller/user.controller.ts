import { Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { User, UserDoc } from "../models/user.models";
import { RequestTyped } from "../types/types";
import path from "path";
import fs from "fs";

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

export const searchUser = async (
  req: RequestTyped<{}, { search?: string }, {}>,
  res: Response
) => {
  let searchObj = {};

  if (req.query.search !== undefined) {
    searchObj = {
      $or: [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { lastName: { $regex: req.query.search, $options: "i" } },
        { username: { $regex: req.query.search, $options: "i" } },
      ],
    };
  }

  User.find(searchObj)
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no user found");
    });
};

export const followUser = async (
  req: RequestTyped<{}, {}, { userId: string }>,
  res: Response
) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (user == null) throw new BadRequestError("no user found");

  const isFollowing =
    user.followers && user.followers.includes(req.currentUser?.id);

  const option = isFollowing ? "$pull" : "$addToSet";

  req.currentUser = (await User.findByIdAndUpdate(
    req.currentUser?.id,
    { [option]: { following: userId } },
    { new: true }
  ).catch((error) => {
    console.log(error);
    throw new BadRequestError("no user found");
  })) as UserDoc;

  User.findByIdAndUpdate(userId, {
    [option]: { followers: req.currentUser?.id },
  }).catch((error) => {
    console.log(error);
    throw new BadRequestError("no user found");
  });

  res.status(200).send(req.currentUser);
};

export const getUserFollowing = async (
  req: RequestTyped<{}, {}, { userId: string }>,
  res: Response
) => {
  User.findById(req.params.userId)
    .populate("following")
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no user found");
    });
};

export const getUserFollowers = async (
  req: RequestTyped<{}, {}, { userId: string }>,
  res: Response
) => {
  User.findById(req.params.userId)
    .populate("followers")
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no user found");
    });
};

export const updateProfileImage = async (
  req: RequestTyped<{}, {}, { userId: string }>,
  res: Response
) => {
  if (!req.file) {
    console.log("No file uploaded with ajax request.");
    return res.sendStatus(400);
  }

  const filePath = `/uploads/images/${req.file.filename}.png`;
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `../../${filePath}`);

  fs.rename(tempPath, targetPath, async (error) => {
    if (error != null) {
      console.log(error);
      return res.sendStatus(400);
    }

    req.currentUser = await User.findByIdAndUpdate(
      req.currentUser?.id,
      { profilePic: filePath },
      { new: true }
    );
    res.sendStatus(204);
  });
};

export const updateProfileBanner = async (
  req: RequestTyped<{}, {}, { userId: string }>,
  res: Response
) => {
  if (!req.file) {
    console.log("No file uploaded with ajax request.");
    return res.sendStatus(400);
  }

  const filePath = `/uploads/images/${req.file.filename}.png`;
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `../../${filePath}`);

  fs.rename(tempPath, targetPath, async (error) => {
    if (error != null) {
      console.log(error);
      return res.sendStatus(400);
    }

    req.currentUser = await User.findByIdAndUpdate(
      req.currentUser?.id,
      { coverPhoto: filePath },
      { new: true }
    );
    res.sendStatus(204);
  });
};
