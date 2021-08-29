import React, { FC } from "react";
import { IPost } from "../../../store/module/post/types/post.types";
import dayjs from "dayjs";
interface IPostContent {
  post: IPost;
}

const PostContent: FC<IPostContent> = ({
  post: { content, createdAt, postedBy, likes, retweetUsers },
}) => {
  return (
    <div className="flex flex-row border-b border-dark-third">
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
        <div className="py-2 mr-3 break-all">{content}</div>
        <div className="flex flex-row text-xl justify-evenly">
          <div className="flex-1 -ml-3 ">
            <div className="w-12 cursor-pointer hover:text-blue-500">
              <div className="p-3 rounded-full ">
                <i className="bx bx-message-rounded"></i>
              </div>
            </div>
          </div>

          <div className="flex-1 ">
            <div className="w-12 cursor-pointer hover:text-green-600">
              <div className="p-3 rounded-full ">
                <i className="bx bx-rotate-right"></i>
              </div>
              {retweetUsers.length > 0 && <p>{retweetUsers.length}</p>}
            </div>
          </div>

          <div className="flex-1 ">
            <div className="w-12 cursor-pointer hover:text-red-600 ">
              <div className="p-3 rounded-full ">
                <i className="bx bx-heart"></i>
              </div>
              {likes.length > 0 && <p>{likes.length}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
