import React, { FC } from "react";
import { IPost } from "../../../store/module/post/types/post.types";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { likePost, retweetPost } from "../../../store/module/post/post.slice";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
interface IPostContentContainer {
  post: IPost;
}

const PostContentContainer: FC<IPostContentContainer> = ({
  post: { content, createdAt, postedBy, likes, retweetUsers, id, retweetData },
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleLikedPost = () => {
    dispatch(likePost(id));
  };

  const handleRetweetedPost = () => {
    dispatch(retweetPost(id));
  };

  const handleRetweetLikedPost = () => {
    dispatch(likePost(retweetData.id));
  };

  const handleRetweetRetweetedPost = () => {
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

  return (
    <div className="flex flex-col border-b border-dark-third">
      {retweetData && (
        <div className="flex flex-row items-center text-sm text-gray-500">
          <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full ">
            <i className="bx bx-rotate-right"></i>
          </div>
          Retweeted by {postedBy.username}
        </div>
      )}
      {retweetData ? (
        <div className="flex flex-row">
          <div className="flex justify-center w-20 pt-2 ">
            <img
              className="w-10 h-10 rounded-full"
              src={retweetData.postedBy?.profilePic}
            />
          </div>
          <div className="flex flex-col flex-1 text-dark-txt ">
            <div className="flex flex-row mt-2">
              <div className="mr-3 font-bold">
                {retweetData.postedBy.username}
              </div>
              <div className="mr-3 text-gray-500">@{postedBy.email}</div>
              <div className="text-gray-500">
                {dayjs(retweetData.createdAt).format("h:mm A	")}
              </div>
            </div>
            <div className=""></div>
            <div className="py-2 mr-3 break-all">{retweetData.content}</div>
            <div className="flex flex-row mt-3 text-xl justify-evenly">
              <div className="flex-1 mt-auto mb-2 -ml-3">
                <div className="w-12 cursor-pointer hover:text-blue-500">
                  <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full hover:bg-opacity-20 hover:bg-blue-300 hover:text-blue-600">
                    <i className="bx bx-message-rounded"></i>
                  </div>
                </div>
              </div>

              <div className="flex-1 mt-auto mb-2">
                <div
                  className={`flex flex-row items-center w-12 cursor-pointer  ${
                    checkRetweetRetweetedPost() ? "text-green-600" : ""
                  }`}
                  onClick={() => handleRetweetRetweetedPost()}
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full hover:bg-opacity-20 hover:bg-green-300 hover:text-green-600">
                    <i className="bx bx-rotate-right"></i>
                  </div>
                  <div className="text-sm">
                    {retweetData.retweetUsers.length > 0 && (
                      <p>{retweetData.retweetUsers.length}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 mt-auto mb-2">
                <div
                  className={`flex flex-row items-center w-12 cursor-pointer  ${
                    checkRetweetLikedPost() ? "text-red-600" : ""
                  }`}
                  onClick={() => handleRetweetLikedPost()}
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full hover:bg-opacity-20 hover:bg-red-300 hover:text-red-600">
                    <i className="bx bx-heart"></i>
                  </div>
                  <div className="text-sm ">
                    {retweetData.likes.length > 0 && (
                      <p>{retweetData.likes.length}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row">
          <div className="flex justify-center w-20 pt-2 ">
            <img
              className="w-10 h-10 rounded-full"
              src={postedBy?.profilePic}
            />
          </div>
          <div className="flex flex-col flex-1 text-dark-txt ">
            <div className="flex flex-row mt-2">
              <div className="mr-3 font-bold">{postedBy.username}</div>
              <div className="mr-3 text-gray-500">@{postedBy.email}</div>
              <div className="text-gray-500">
                {dayjs(createdAt).format("h:mm A	")}
              </div>
            </div>
            <div className=""></div>
            <div className="py-2 mr-3 break-all">{content}</div>
            <div className="flex flex-row mt-3 text-xl justify-evenly">
              <div className="flex-1 mt-auto mb-2 -ml-3">
                <div className="w-12 cursor-pointer hover:text-blue-500">
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
                  onClick={() => handleRetweetedPost()}
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
                    checkLikedPost() ? "text-red-600" : ""
                  }`}
                  onClick={() => handleLikedPost()}
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
      )}
    </div>
  );
};

export default PostContentContainer;
