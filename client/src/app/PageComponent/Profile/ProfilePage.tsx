import { Transition, Dialog } from "@headlessui/react";
import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { selectCurrentUser } from "../../store/module/auth/auth.slice";
import { getUserProfile } from "../../store/module/user/user.slice";
import { RootState } from "../../store/store";
import Navigate from "../../utils/Navigate";
import NotFound from "../NotFound/NotFound";
import ReplyPostModal from "../Tweet/components/ReplyPostModal";
import ProfileBanner from "./components/ProfileBanner";
import ProfileLikes from "./components/ProfileLikes";
import ProfileMedia from "./components/ProfileMedia";
import ProfileTweet from "./components/ProfileTweet";
import ProfileTweetReplies from "./components/ProfileTweetReplies";

const ProfilePage = () => {
  let { path, url } = useRouteMatch();
  const { profileUsername } = useParams<{ profileUsername: string }>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );

  const HandleGoHome = () => {
    Navigate?.push("/home");
  };

  const HandleClosingModal = () => {
    Navigate?.push(`/profile`);
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    dispatch(getUserProfile(profileUsername));
  }, [profileUsername]);

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

          <div className="text-xl ">{currentUser?.username}</div>
        </div>
        <ProfileBanner url={url} />
        <div className="relative w-tweet">
          <Switch>
            <Route path={`${path}profile/likes`}>
              <ProfileLikes backUrl={url} />
            </Route>
            <Route path={`${path}profile/media`}>
              <ProfileMedia backUrl={url} />
            </Route>
            <Route path={`${path}profile/with_replies`}>
              <ProfileTweetReplies backUrl={url} />
            </Route>
            <Route path={`${path}profile`}>
              <ProfileTweet backUrl={url} />
            </Route>
            <Route path="*" component={NotFound} />
          </Switch>
          {scrollPosition > 200 && (
            <div
              className="fixed z-50 p-3 cursor-pointer bottom-2 bg-dark-third text-dark-txt rounded-3xl left-3/4"
              onClick={() => window.scrollTo(0, 0)}
            >
              Back to top
            </div>
          )}
        </div>
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

export default ProfilePage;
