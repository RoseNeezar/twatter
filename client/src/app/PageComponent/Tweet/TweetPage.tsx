import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, useEffect } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { fetchPost, getPosts } from "../../store/module/post/post.slice";
import Navigate from "../../utils/Navigate";
import CreatePost from "./components/CreatePost";
import PostContentContainer from "./components/PostContentContainer";
import ReplyPostModal from "./components/ReplyPostModal";

interface ITweetPage {
  backUrl: string;
}

const TweetPage: FC<ITweetPage> = ({ backUrl }) => {
  let { url } = useRouteMatch();

  const dispatch = useAppDispatch();
  const Posts = useAppSelector(getPosts);

  const HandleClosingModal = () => {
    Navigate?.push(`/home`);
  };

  useEffect(() => {
    dispatch(
      fetchPost({
        followingOnly: true,
      })
    );
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 598 }}
          className="fixed top-0 z-50 p-3 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
        >
          <div className="text-xl ">Home</div>
        </div>
        <CreatePost />
        {Posts?.map((res) => {
          return (
            <PostContentContainer key={res.id} post={res} backUrl={backUrl} />
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
                      <ReplyPostModal />
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

export default TweetPage;
