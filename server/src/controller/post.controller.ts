import { Request, Response } from "express";
import { ICreatePost, IGetPostQuery, IPinnedPost } from "../dto/post.dto";
import { BadRequestError } from "../errors/bad-request-error";
import { Post, PostAttrs } from "../models/post.models";
import { User } from "../models/user.models";
import { GetPosts } from "../services/getPosts";
import { RequestTyped } from "../types/types";

export const createPost = async (
  req: Request<{}, {}, ICreatePost>,
  res: Response
) => {
  if (!req.body.content) {
    console.log("Content param not sent with request");
    return res.sendStatus(400);
  }

  let postData: Partial<PostAttrs> = {
    content: req.body.content as string,
    postedBy: req.currentUser?.id,
  };

  if (!!req.body.replyTo) {
    postData.replyTo = req.body.replyTo;
  }

  Post.create(postData)
    .then(async (newPost) => {
      newPost = await User.populate(newPost, { path: "postedBy" });
      newPost = await Post.populate(newPost, { path: "replyTo" });

      res.status(201).send(newPost);
    })
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("Error creating post");
    });
};

export const getPosts = async (
  req: Request<{}, {}, {}, Partial<IGetPostQuery>>,
  res: Response
) => {
  let searchObj = req.query;

  if (searchObj.isReply !== undefined) {
    const isReply = searchObj.isReply === true;
    searchObj.replyTo = { $exists: isReply };

    delete searchObj.isReply;
  }

  if (searchObj.search !== undefined) {
    searchObj.content = { $regex: searchObj.search, $options: "i" };
    delete searchObj.search;
  }

  if (searchObj.followingOnly !== undefined) {
    const followingOnly = searchObj.followingOnly === true;

    if (followingOnly) {
      var objectIds = [];

      if (!req.currentUser?.following) {
        req.currentUser!.following = [];
      }

      req.currentUser?.following.forEach((user) => {
        objectIds.push(user);
      });

      objectIds.push(req.currentUser?.id);
      searchObj.postedBy = { $in: objectIds };
    }

    delete searchObj.followingOnly;
  }

  const results = await GetPosts.getPosts(searchObj);
  res.status(200).send(results);
};

export const getPostById = async (
  req: RequestTyped<{}, {}, { id: string }>,
  res: Response
) => {
  const postId = req.params.id;

  let postData: any = await GetPosts.getPosts({ _id: postId });
  postData = postData[0];

  let results: any = {
    postData: postData,
  };

  if (postData.replyTo !== undefined) {
    results.replyTo = postData.replyTo;
  }

  results.replies = await GetPosts.getPosts({ replyTo: postId });

  res.status(200).send(results);
};

export const deletePost = async (
  req: RequestTyped<{}, {}, { id: string }>,
  res: Response
) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(202))
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no post with id");
    });
};

export const pinnedPost = async (
  req: RequestTyped<IPinnedPost, {}, { id: string }>,
  res: Response
) => {
  if (req.body.pinned !== undefined) {
    await Post.updateMany(
      { postedBy: req.currentUser!.id },
      { pinned: false }
    ).catch((error) => {
      console.log(error);
      throw new BadRequestError("no post with id");
    });
  }

  Post.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no post with id");
    });
};
