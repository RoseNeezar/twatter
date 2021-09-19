import { Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { User, UserDoc } from "../models/user.models";
import { RequestTyped } from "../types/types";
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

  if (!req.file) {
    console.log("No file uploaded with ajax request.");
    throw new BadRequestError("No file uploaded with ajax request.");
  }
  const oldImageTemp = req.currentUser!.profilePic!.split("/");
  const imgRex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
  if (oldImageTemp) {
    const oldImage = oldImageTemp[oldImageTemp!.length - 1];
    if (imgRex.test(oldImage)) {
      fs.unlinkSync(`public/images/${oldImage}`);
    }
  }

  try {
    req.currentUser = await User.findByIdAndUpdate(
      req.currentUser?.id,
      { profilePic: `${process.env.APP_URL}/images/${req.file.filename}` },
      { new: true }
    );
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("no file found");
  }
};

export const updateProfileBanner = async (
  req: RequestTyped<{}, {}, { userId: string }>,
  res: Response
) => {
  if (!req.file) {
    console.log("No file uploaded with ajax request.");
    throw new BadRequestError("No file uploaded with ajax request.");
  }
  const oldBannerTemp = req.currentUser!.coverPhoto!.split("/");
  const imgRex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
  if (oldBannerTemp) {
    const oldBanner = oldBannerTemp[oldBannerTemp!.length - 1];
    if (imgRex.test(oldBanner)) {
      fs.unlinkSync(`public/images/${oldBanner}`);
    }
  }

  try {
    req.currentUser = await User.findByIdAndUpdate(
      req.currentUser?.id,
      { coverPhoto: `${process.env.APP_URL}/images/${req.file.filename}` },
      { new: true }
    );

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("no file found");
  }
};
