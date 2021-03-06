import { Request, Response } from "express";
import { Types } from "mongoose";
import { ICreatePost, IGetPostQuery, IPinnedPost } from "../dto/post.dto";
import { BadRequestError } from "../errors/bad-request-error";
import { Notification } from "../models/notification.models";
import { Post, PostAttrs, PostDoc } from "../models/post.models";
import { User, UserDoc } from "../models/user.models";
import { GetPosts } from "../services/getPosts";
import { RequestTyped } from "../types/types";

export const createPost = async (
  req: Request<{}, {}, ICreatePost>,
  res: Response
) => {
  if (!req.body.content) {
    console.log("Content param not sent with request");
    throw new BadRequestError("Error creating post");
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

      if (!!newPost.replyTo) {
        const postedBy = newPost.replyTo as PostDoc;

        if (String(postedBy.postedBy) !== req.currentUser?.id) {
          await Notification.insertNotification(
            postedBy.postedBy as string,
            req.currentUser?.id,
            "replyPost",
            newPost.id
          );
        }
      }

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
    const isReply = searchObj.isReply;

    searchObj.replyTo = { $exists: isReply };

    delete searchObj.isReply;
  }

  if (searchObj.search !== undefined) {
    searchObj.content = { $regex: searchObj.search, $options: "i" };
    delete searchObj.search;
  }

  if (searchObj.followingOnly !== undefined) {
    const followingOnly = searchObj.followingOnly;

    if (followingOnly) {
      const objectIds: Types.ObjectId[] = [];

      if (!req.currentUser?.following) {
        req.currentUser!.following = [];
      }

      req.currentUser?.following.forEach((user) => {
        objectIds.push(Types.ObjectId(user));
      });

      objectIds.push(Types.ObjectId(req.currentUser?.id));

      const option = "$in";

      searchObj.postedBy = { [option]: objectIds };
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
  await Post.findByIdAndDelete(req.params.id)
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

  Post.findByIdAndUpdate(req.params.id, { pinned: req.body.pinned })
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no post with id");
    });
};

export const likePost = async (
  req: RequestTyped<IPinnedPost, {}, { id: string }>,
  res: Response
) => {
  const postId = req.params.id;
  const userId = req.currentUser?.id;

  const isLiked =
    req.currentUser?.likes && req.currentUser?.likes.includes(postId);

  //add or remove from array

  const option = isLiked ? "$pull" : "$addToSet";

  // Insert user like
  req.currentUser = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: postId } },
    { new: true }
  ).catch((error) => {
    console.log(error);
    throw new BadRequestError("no post with id");
  });

  // Insert post like
  let post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  )
    .populate("postedBy")
    .populate("replyTo")
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no post with id");
    });

  if (!isLiked && post !== null) {
    const postedBy = post.postedBy as UserDoc;
    if (postedBy.id !== userId) {
      await Notification.insertNotification(
        postedBy.id,
        userId,
        "likePost",
        post.id
      );
    }
  }
  post = await User.populate(post, { path: "replyTo.postedBy" });
  res.status(200).send(post);
};

export const retweetPost = async (
  req: RequestTyped<{}, {}, { id: string }>,
  res: Response
) => {
  const postId = req.params.id;
  const userId = req.currentUser?.id;

  // Try and delete retweet
  const deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    retweetData: postId,
  }).catch((error) => {
    console.log(error);
    throw new BadRequestError("no post with id");
  });
  //add remove retweet
  const option = deletedPost !== null ? "$pull" : "$addToSet";

  let repost = deletedPost;

  if (repost === null) {
    repost = await Post.create({ postedBy: userId, retweetData: postId }).catch(
      (error) => {
        console.log(error);
        throw new BadRequestError("no post with id");
      }
    );
  }

  // Insert user like
  req.currentUser = await User.findByIdAndUpdate(
    userId,
    { [option]: { retweets: repost?.id } },
    { new: true }
  ).catch((error) => {
    console.log(error);
    throw new BadRequestError("no post with id");
  });

  // Insert post like
  let post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { retweetUsers: userId } },
    { new: true }
  )
    .populate("postedBy")
    .populate("replyTo")
    .catch((error) => {
      console.log(error);
      throw new BadRequestError("no post with id");
    });

  post = await User.populate(post, { path: "replyTo.postedBy" });

  if (!deletedPost && post !== null) {
    const postedBy = post.postedBy as UserDoc;
    if (postedBy.id !== userId) {
      await Notification.insertNotification(
        postedBy.id,
        userId,
        "retweetPost",
        post.id
      );
    }
  }

  res.status(200).send(post);
};
