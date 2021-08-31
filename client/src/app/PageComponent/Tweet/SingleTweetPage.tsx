import { Transition, Dialog, Popover } from "@headlessui/react";
import React, {
  Fragment,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Route, useParams, useRouteMatch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { selectCurrentUser } from "../../store/module/auth/auth.slice";
import {
  deletePost,
  getReplyPost,
  likePost,
  retweetPost,
} from "../../store/module/post/post.slice";
import { RootState } from "../../store/store";
import Navigate from "../../utils/Navigate";
import PostContent from "../Tweet/components/PostContent";
import PostContentContainer from "../Tweet/components/PostContentContainer";
import ReplyPostModal from "../Tweet/components/ReplyPostModal";

const SingleTweetPage = () => {
  const { tweetId } = useParams<{ tweetId: string }>();
  const { url } = useRouteMatch();
  const getPost = useAppSelector((state: RootState) => state.posts.replyPost);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const [openPopover, setOpenPopover] = useState(false);
  const popoverButtonRef = useRef<HTMLButtonElement>(null);

  const handleLikedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(likePost(tweetId));
  };

  const handleRetweetedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(retweetPost(tweetId));
  };

  const checkLikedPost = () => {
    const likedIndex = currentUser?.likes?.findIndex((re) => re === tweetId);
    return likedIndex !== -1 ? true : false;
  };

  const checkRetweetedPost = () => {
    const retweetIndex = getPost?.postData.retweetUsers.findIndex(
      (re) => re === currentUser?.id
    );
    return retweetIndex !== -1 ? true : false;
  };

  const handleRetweetLikedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(likePost(tweetId));
  };

  const handleRetweetRetweetedPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(retweetPost(tweetId));
  };

  const checkRetweetLikedPost = () => {
    const likedIndex = currentUser?.likes?.findIndex(
      (re) => re === getPost?.postData.retweetData.id
    );
    return likedIndex !== -1 ? true : false;
  };

  const checkRetweetRetweetedPost = () => {
    const retweetIndex = getPost?.postData.retweetData.retweetUsers.findIndex(
      (re) => re === currentUser?.id
    );
    return retweetIndex !== -1 ? true : false;
  };

  const HandleClosingModal = () => {
    Navigate?.goBack();
  };

  const HandleGoHome = () => {
    Navigate?.push("/home");
  };

  const HandleReplyPost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    Navigate?.push(`${url}/tweet/${tweetId}`);
  };

  const HandleOpenPopover = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setOpenPopover(!openPopover);
  };

  const HandleDeletePost = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(deletePost({ id: getPost!.postData.id }));
    Navigate?.push("/home");
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

  useEffect(() => {
    dispatch(getReplyPost(tweetId));
  }, [dispatch, tweetId, getReplyPost]);
  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 598 }}
          className="fixed top-0 flex flex-row items-center p-2 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
        >
          <div
            className="flex justify-center p-2 mr-5 text-2xl font-bold rounded-full cursor-pointer text-dark-txt hover:bg-dark-third"
            onClick={() => HandleGoHome()}
          >
            <i className="bx bx-left-arrow-alt"></i>
          </div>
          {getPost?.postData.retweetData ? (
            <div className="text-xl ">Threads</div>
          ) : (
            <div className="text-xl ">Tweet</div>
          )}
        </div>
        <div className="mt-14 "></div>
        {getPost?.postData && (
          <div className="flex flex-col border-b border-dark-third ">
            <>
              {getPost?.postData.retweetData && (
                <div className="flex flex-row items-center text-sm text-gray-500">
                  <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-full ">
                    <i className="bx bx-rotate-right"></i>
                  </div>
                  Retweeted by {getPost?.postData.postedBy.username}
                </div>
              )}
              {!getPost?.postData.retweetData &&
                getPost.postData.postedBy.id === currentUser?.id && (
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
            </>

            {getPost?.postData.retweetData ? (
              <PostContent
                post={getPost?.postData.retweetData}
                HandleReplyPost={HandleReplyPost}
                checkLikedPost={checkRetweetLikedPost}
                checkRetweetedPost={checkRetweetRetweetedPost}
                handleLikedPost={handleRetweetLikedPost}
                handleRetweetedPost={handleRetweetRetweetedPost}
                isRetweet={true}
              />
            ) : (
              <PostContent
                post={getPost?.postData}
                HandleReplyPost={HandleReplyPost}
                checkLikedPost={checkLikedPost}
                checkRetweetedPost={checkRetweetedPost}
                handleLikedPost={handleLikedPost}
                handleRetweetedPost={handleRetweetedPost}
                isRetweet={false}
              />
            )}
          </div>
        )}
        {getPost?.replies?.map((res) => {
          return (
            <PostContentContainer
              key={res.id}
              post={res}
              backUrl={url}
              isSinglePost={true}
            />
          );
        })}
      </div>
      <Route
        path={`${url}/tweet/:tweetId`}
        children={({ match }) => {
          return (
            <Transition appear show={Boolean(match)} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={() => HandleClosingModal()}
              >
                <div className="min-h-screen px-4 text-center">
                  <Dialog.Overlay className="fixed inset-0 bg-gray-600 opacity-25" />
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="inline-block max-w-6xl my-16 overflow-hidden text-left align-middle transition-all transform bg-red-300 shadow-xl w-tweet rounded-2xl">
                      <ReplyPostModal isSinglePost={true} />
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          );
        }}
      />
    </>
  );
};

export default SingleTweetPage;
