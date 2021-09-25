import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { selectCurrentUser } from "../../store/module/auth/auth.slice";
import { IUser } from "../../store/module/auth/types/auth.model";
import useSocket from "../../store/websockets/websockets";
import MessagesPage from "../Messages/MessagesPage";
import NotFound from "../NotFound/NotFound";
import NotificationPage from "../Notification/NotificationPage";
import ProfilePageActions from "../Profile/components/ProfilePageActions";
import ProfilePage from "../Profile/ProfilePage";
import SearchPage from "../Search/SearchPage";
import TweetAction from "../Tweet/components/TweetAction";
import SingleTweetPage from "../Tweet/SingleTweetPage";
import TweetPage from "../Tweet/TweetPage";
import RedirectHome from "./RedirectHome";

const Home = () => {
  let { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const messagesRoute = "/messages";
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

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

  useSocket(currentUser as IUser, dispatch);

  return (
    <>
      <Head>
        <title>Twatter</title>
      </Head>
      <div className="overflow-x-hidden">
        <div
          className={` flex  ${
            !pathname.includes(messagesRoute) ? "" : "-mr-96"
          } `}
        >
          <div className="flex-col justify-end h-full w-36 xl:flex-1">
            <Sidebar url={url} />
          </div>
          <div
            className={`relative   w-tweet  ${
              pathname.includes(messagesRoute) &&
              "w-messageContainer  relative "
            }`}
          >
            <Switch>
              <Route path={`${path}home`}>
                <TweetPage backUrl={url} />
              </Route>
              <Route
                path={`${path}:username/status/:tweetId`}
                component={SingleTweetPage}
              />
              <Route
                path={`${path}profile/:profileUsername`}
                component={ProfilePage}
              />
              <Route path={`${path}search`} component={SearchPage} />
              <Route path={`${path}messages`} component={MessagesPage} />
              <Route
                exact
                path={`${path}notification`}
                component={NotificationPage}
              />
              <Route path={`${path}`} component={RedirectHome} />
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
          <div
            className={`flex-col justify-start flex-1 hidden h-full lg:flex `}
          >
            <Switch>
              <Route path={`${path}messages`} component={ProfilePageActions} />
              <Route path="*">
                <TweetAction />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
