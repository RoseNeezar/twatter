import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import {
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { getUser, selectCurrentUser } from "../../store/module/auth/auth.slice";
import { getUserProfile } from "../../store/module/user/user.slice";
import { RootState } from "../../store/store";
import Navigate from "../../utils/Navigate";
import NotFound from "../NotFound/NotFound";
import ReplyPostModal from "../Tweet/components/ReplyPostModal";
import EditProfileModal from "./components/EditProfileModal";
import ProfileBanner from "./components/ProfileBanner";
import ProfileFollowBanner from "./components/ProfileFollowBanner";
import ProfileFollowers from "./components/ProfileFollowers";
import ProfileFollowing from "./components/ProfileFollowing";
import ProfileLikes from "./components/ProfileLikes";
import ProfileMedia from "./components/ProfileMedia";
import ProfileTweet from "./components/ProfileTweet";
import ProfileTweetReplies from "./components/ProfileTweetReplies";

const ProfilePage = () => {
  let { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const followRoutes = [`/followers`, `/following`];
  const { profileUsername } = useParams<{ profileUsername: string }>();
  const dispatch = useAppDispatch();
  const currentProfileUser = useAppSelector(
    (state: RootState) => state.user.currentUserProfile
  );
  const currentUser = useAppSelector(selectCurrentUser);
  const HandleGoHome = () => {
    checkFollowRoute()
      ? Navigate?.push(`/profile/${profileUsername}`)
      : Navigate?.push("/home");
  };

  const HandleClosingModal = () => {
    Navigate?.goBack();
    dispatch(getUser());
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
  const checkFollowRoute = () => {
    return followRoutes.findIndex((re) => pathname.includes(re)) !== -1
      ? true
      : false;
  };
  useEffect(() => {
    dispatch(getUserProfile(profileUsername));
  }, [profileUsername, currentUser]);

  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 598 }}
          className="fixed top-0 z-50 flex flex-row items-center p-2 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
        >
          <div
            className="flex justify-center p-2 mr-5 text-2xl font-bold rounded-full cursor-pointer text-dark-txt hover:bg-dark-third"
            onClick={() => HandleGoHome()}
          >
            <i className="bx bx-left-arrow-alt"></i>
          </div>

          <div className="text-xl ">{currentProfileUser?.username}</div>
        </div>
        {!checkFollowRoute() ? (
          <ProfileBanner url={url} />
        ) : (
          <ProfileFollowBanner backUrl={url} />
        )}
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
            <Route path={`${path}profile/followers`}>
              <ProfileFollowers backUrl={url} />
            </Route>
            <Route path={`${path}profile/following`}>
              <ProfileFollowing backUrl={url} />
            </Route>
            <Route path={`${path}profile`}>
              <ProfileTweet backUrl={url} />
            </Route>
            <Route path="*" component={NotFound} />
            {scrollPosition > 200 && (
              <div
                className="fixed z-50 p-3 cursor-pointer bottom-2 bg-dark-third text-dark-txt rounded-3xl left-3/4"
                onClick={() => window.scrollTo(0, 0)}
              >
                Back to top
              </div>
            )}
          </Switch>
        </div>
      </div>
      <Route
        path={[`${url}/tweet/:tweetId`, `${url}/with_replies/tweet/:tweetId`]}
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
                      <ReplyPostModal isProfilePost={true} />
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          );
        }}
      />
      <Route
        path={[
          `${url}/settings/profile`,
          `${url}/with_replies/settings/profile`,
        ]}
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
                      <EditProfileModal />
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
