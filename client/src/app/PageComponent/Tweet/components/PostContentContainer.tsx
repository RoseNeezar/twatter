import { Popover, Transition } from "@headlessui/react";
import React, {
  FC,
  Fragment,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouteMatch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { selectCurrentUser } from "../../../store/module/auth/auth.slice";
import {
  deletePost,
  likePost,
  retweetPost,
} from "../../../store/module/post/post.slice";
import { IPost } from "../../../store/module/post/types/post.types";
import Navigate from "../../../utils/Navigate";
import PostContent from "./PostContent";
interface IPostContentContainer {
  post: IPost;
  backUrl: string;
  isSinglePost?: boolean;
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
  isSinglePost,
}) => {
  const { url } = useRouteMatch();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const [openPopover, setOpenPopover] = useState(false);
  const popoverButtonRef = useRef<HTMLButtonElement>(null);
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
    if (isSinglePost || (!content && !retweetData)) {
      return;
    }
    Navigate?.push(`${backUrl}${postedBy.username}/status/${id}`);
  };

  const HandleOpenPopover = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    setOpenPopover(!openPopover);
  };

  const HandleDeletePost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    replyTo
      ? dispatch(deletePost({ id, replyTo: replyTo.id }))
      : dispatch(deletePost({ id }));
  };

  const handleClickOutside = (event: Event) => {
    if (
      popoverButtonRef.current &&
      !popoverButtonRef.current.contains(event.target as Node)
    ) {
      event.stopPropagation();
      setOpenPopover(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <div
      className={`flex flex-col border-b  border-dark-third ${
        !retweetData && !content ? "" : "hover:bg-dark-second cursor-pointer"
      }`}
      onClick={(event) => HandleToTweet(event)}
    >
      <div className="flex flex-row ">
        {retweetData && (
          <div className="flex flex-row items-center text-sm text-gray-500">
            <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full ">
              <i className="bx bx-rotate-right"></i>
            </div>
            Retweeted by {postedBy.username}
          </div>
        )}
        {!retweetData && !content && (
          <div className="flex flex-row items-center text-sm text-gray-500">
            <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full ">
              <i className="bx bx-rotate-right"></i>
            </div>
            Retweeted by {postedBy.username}
          </div>
        )}
        {!retweetData && content && postedBy.id === currentUser?.id && (
          <div className="mt-1 ml-auto mr-3">
            <Popover className="relative h-5">
              <>
                <Popover.Button
                  ref={popoverButtonRef}
                  className="text-xl text-dark-txt"
                >
                  <div
                    className=""
                    onClick={(event) => HandleOpenPopover(event)}
                  >
                    <i className="bx bx-dots-horizontal-rounded"></i>
                  </div>
                </Popover.Button>
                <Transition
                  show={openPopover}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  {openPopover && (
                    <Popover.Panel
                      static={openPopover}
                      className="absolute z-10 w-40 max-w-sm px-4 transform -translate-x-1/2 cursor-pointer left-1/2 sm:px-0 lg:max-w-3xl"
                    >
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div
                          className="relative grid gap-1 p-3 text-center bg-dark-third text-dark-txt"
                          onClick={(event) => HandleDeletePost(event)}
                        >
                          Delete
                        </div>
                      </div>
                    </Popover.Panel>
                  )}
                </Transition>
              </>
            </Popover>
          </div>
        )}
      </div>

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
      ) : !retweetData && !content ? (
        <PostContent
          deletedPost={true}
          post={post}
          HandleReplyPost={HandleReplyPost}
          checkLikedPost={checkLikedPost}
          checkRetweetedPost={checkRetweetedPost}
          handleLikedPost={handleLikedPost}
          handleRetweetedPost={handleRetweetedPost}
          isRetweet={false}
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
