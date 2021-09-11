import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks/hooks";
import { getUser } from "../../store/module/auth/auth.slice";
import { resetPost } from "../../store/module/post/post.slice";
import { resetSearchUser } from "../../store/module/user/user.slice";
import Navigate from "../../utils/Navigate";
import NotFound from "../NotFound/NotFound";
import ReplyPostModal from "../Tweet/components/ReplyPostModal";
import SearchPosts from "./components/SearchPosts";
import SearchTabs from "./components/SearchTabs";
import SearchUser from "./components/SearchUser";

const SearchPage = () => {
  let { path, url } = useRouteMatch();
  const dispatch = useAppDispatch();
  const [scrollPosition, setScrollPosition] = useState(0);

  const HandleClosingModal = () => {
    Navigate?.goBack();
    dispatch(getUser());
  };

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
    dispatch(resetPost());
    dispatch(resetSearchUser());
  }, []);

  return (
    <>
      <div className="flex flex-col w-full min-h-screen border-l border-r border-dark-third">
        <div
          style={{ width: 598 }}
          className="fixed top-0 z-50 p-3 font-bold border-b bg-dark-main text-dark-txt border-dark-third"
        >
          <div className="text-xl ">Search</div>
        </div>
        <SearchTabs backUrl={url} />
        <div className="relative w-tweet">
          <Switch>
            <Route path={`${path}/users`}>
              <SearchUser backUrl={url} />
            </Route>
            <Route path={`${path}/posts`}>
              <SearchPosts backUrl={url} />
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
        path={[`${url}/posts/tweet/:tweetId`]}
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
    </>
  );
};

export default SearchPage;
