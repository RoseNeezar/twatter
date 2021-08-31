import dayjs from "dayjs";
import React, { FC, MouseEvent } from "react";
import {
  IPost,
  RetweetData,
} from "../../../store/module/post/types/post.types";

interface IPostContent {
  post: IPost | RetweetData;
  HandleReplyPost: (event: MouseEvent<HTMLDivElement>) => void;
  checkRetweetedPost: () => boolean;
  handleRetweetedPost: (event: MouseEvent<HTMLDivElement>) => void;
  checkLikedPost: () => boolean;
  handleLikedPost: (event: MouseEvent<HTMLDivElement>) => void;
  isRetweet?: boolean;
}

const PostContent: FC<IPostContent> = ({
  post: { content, createdAt, postedBy, likes, retweetUsers, id, replyTo },
  HandleReplyPost,
  checkLikedPost,
  checkRetweetedPost,
  handleLikedPost,
  handleRetweetedPost,
  isRetweet,
}) => {
  return (
    <div className="relative flex flex-row">
      <div className="flex justify-center w-20 pt-2 ">
        <img className="w-10 h-10 rounded-full" src={postedBy?.profilePic} />
      </div>
      <div className="flex flex-col flex-1 text-dark-txt ">
        <div className="flex flex-row mt-2">
          <div className="mr-3 font-bold">{postedBy.username}</div>
          <div className="mr-3 text-gray-500">@{postedBy.email}</div>
          <div className="text-gray-500">
            {dayjs(createdAt).format("h:mm A	")}
          </div>
        </div>
        {!isRetweet && replyTo && (
          <div className="flex flex-row items-center mt-2 text-sm text-gray-500 ">
            Replying to
            <div className="pl-1 text-blue-400 cursor-pointer">
              @{replyTo?.postedBy?.username}
            </div>
          </div>
        )}
        <div className="relative py-2 mr-3 break-all">{content}</div>
        <div className="flex flex-row mt-3 text-xl justify-evenly">
          <div className="flex-1 mt-auto mb-2 -ml-3">
            <div
              className="w-12 cursor-pointer hover:text-blue-500"
              onClick={(event) => HandleReplyPost(event)}
            >
              <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full hover:bg-opacity-20 hover:bg-blue-300 hover:text-blue-600">
                <i className="bx bx-message-rounded"></i>
              </div>
            </div>
          </div>

          <div className="flex-1 mt-auto mb-2">
            <div
              className={`flex flex-row items-center w-12 cursor-pointer  ${
                checkRetweetedPost() ? "text-green-600" : ""
              }`}
              onClick={(event) => handleRetweetedPost(event)}
            >
              <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full hover:bg-opacity-20 hover:bg-green-300 hover:text-green-600">
                <i className="bx bx-rotate-right"></i>
              </div>
              <div className="text-sm">
                {retweetUsers.length > 0 && <p>{retweetUsers.length}</p>}
              </div>
            </div>
          </div>

          <div className="flex-1 mt-auto mb-2">
            <div
              className={`flex flex-row items-center w-12 cursor-pointer  ${
                likes.length > 0 && checkLikedPost() ? "text-red-600" : ""
              }`}
              onClick={(event) => handleLikedPost(event)}
            >
              <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full hover:bg-opacity-20 hover:bg-red-300 hover:text-red-600">
                <i className="bx bx-heart"></i>
              </div>
              <div className="text-sm ">
                {likes.length > 0 && <p>{likes.length}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
