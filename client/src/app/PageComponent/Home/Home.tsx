import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Route, Switch, useLocation, useRouteMatch } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import MessagesAction from "../Messages/components/MessagesAction";
import MessagesPage from "../Messages/MessagesPage";
import NotFound from "../NotFound/NotFound";
import NotificationPage from "../Notification/NotificationPage";
import ProfilePageActions from "../Profile/components/ProfilePageActions";
import ProfilePage from "../Profile/ProfilePage";
import SearchPage from "../Search/SearchPage";
import TweetAction from "../Tweet/components/TweetAction";
import SingleTweetPage from "../Tweet/SingleTweetPage";
import TweetPage from "../Tweet/TweetPage";

const Home = () => {
  let { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const messagesRoute = "/messages";

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
  return (
    <>
      <Head>
        <title>Twatter</title>
      </Head>

      <div
        className={`flex justify-start overflow-auto lg:justify-center ${
          !pathname.includes(messagesRoute) ? "mr-48" : "mr-24"
        }`}
      >
        <div className="flex-col justify-end h-full sm:w-1/6 lg:flex-1 md:flex">
          <Sidebar url={url} />
        </div>
        <div
          className={`relative w-tweet ${
            pathname.includes(messagesRoute) && "w-messageContainer  relative "
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
          className={`flex-col justify-start flex-1 hidden h-full lg:flex ${
            pathname.includes(messagesRoute) && "lg:hidden "
          }`}
        >
          <Switch>
            <Route
              exact
              path={`${path}:username/status/:tweetId`}
              component={TweetAction}
            />
            <Route path={`${path}profile`} component={ProfilePageActions} />
            <Route path="*">
              <TweetAction />
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default Home;
