import React, { FC, MouseEvent } from "react";
import {
  IPost,
  RetweetData,
} from "../../../store/module/post/types/post.types";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { likePost, retweetPost } from "../../../store/module/post/post.slice";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import Navigate from "../../../utils/Navigate";
import { useRouteMatch } from "react-router-dom";
import PostContent from "./PostContent";
interface IPostContentContainer {
  post: IPost;
  backUrl: string;
}

const PostContentContainer: FC<IPostContentContainer> = ({
  post,
  post: {
    content,
    createdAt,
    postedBy,
    likes,
    retweetUsers,
    id,
    retweetData,
    replyTo,
  },
  backUrl,
}) => {
  const { url } = useRouteMatch();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLikedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(likePost(id));
  };

  const handleRetweetedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(retweetPost(id));
  };

  const handleRetweetLikedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(likePost(retweetData.id));
  };

  const handleRetweetRetweetedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(retweetPost(retweetData.id));
  };

  const checkLikedPost = () => {
    const likedIndex = currentUser?.likes?.findIndex((re) => re === id);
    return likedIndex !== -1 ? true : false;
  };

  const checkRetweetedPost = () => {
    const retweetIndex = retweetUsers.findIndex((re) => re === currentUser?.id);
    return retweetIndex !== -1 ? true : false;
  };

  const checkRetweetLikedPost = () => {
    const likedIndex = currentUser?.likes?.findIndex(
      (re) => re === retweetData.id
    );
    return likedIndex !== -1 ? true : false;
  };

  const checkRetweetRetweetedPost = () => {
    const retweetIndex = retweetData.retweetUsers.findIndex(
      (re) => re === currentUser?.id
    );
    return retweetIndex !== -1 ? true : false;
  };

  const HandleReplyPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    Navigate?.push(`${url}/tweet/${id}`);
  };

  const HandleToTweet = (event: MouseEvent<HTMLDivElement>) => {
    console.log("to ?-");

    Navigate?.push(`${backUrl}${postedBy.username}/status/${id}`);
  };

  return (
    <div
      className="flex flex-col border-b cursor-pointer border-dark-third hover:bg-dark-second"
      onClick={(event) => HandleToTweet(event)}
    >
      {retweetData && (
        <div className="flex flex-row items-center text-sm text-gray-500">
          <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full ">
            <i className="bx bx-rotate-right"></i>
          </div>
          Retweeted by {postedBy.username}
        </div>
      )}
      {retweetData ? (
        <PostContent
          post={retweetData}
          HandleReplyPost={HandleReplyPost}
          checkLikedPost={checkRetweetLikedPost}
          checkRetweetedPost={checkRetweetRetweetedPost}
          handleLikedPost={handleRetweetLikedPost}
          handleRetweetedPost={handleRetweetRetweetedPost}
          isRetweet={true}
        />
      ) : (
        <PostContent
          post={post}
          HandleReplyPost={HandleReplyPost}
          checkLikedPost={checkLikedPost}
          checkRetweetedPost={checkRetweetedPost}
          handleLikedPost={handleLikedPost}
          handleRetweetedPost={handleRetweetedPost}
          isRetweet={false}
        />
      )}
    </div>
  );
};

export default PostContentContainer;
