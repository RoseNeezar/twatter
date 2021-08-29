import React, { useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Head from "next/head";
import Sidebar from "../../components/Sidebar/Sidebar";
import TweetPage from "../Tweet/TweetPage";
import NotFound from "../NotFound/NotFound";
import TweetAction from "../Tweet/components/TweetAction";
import RedirectHome from "./RedirectHome";
import NotificationPage from "../Notification/NotificationPage";
import NotificationAction from "../Notification/components/NotificationAction";

const Home = () => {
  let { path, url } = useRouteMatch();
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

      <div className="flex justify-start overflow-auto lg:justify-center">
        <div className="flex-col justify-end h-full sm:w-1/6 lg:flex-1 md:flex">
          <Sidebar url={url} />
        </div>
        <div className="relative w-tweet ">
          <Switch>
            <Route exact path={`${path}home`} component={TweetPage} />
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
              className="fixed p-3 cursor-pointer bottom-2 bg-dark-third text-dark-txt rounded-3xl left-3/4"
              onClick={() => window.scrollTo(0, 0)}
            >
              Back to top
            </div>
          )}
        </div>
        <div className="flex-col justify-start flex-1 hidden h-full lg:flex">
          <Switch>
            <Route exact path={`${path}home`} component={TweetAction} />
            <Route
              exact
              path={`${path}notification`}
              component={NotificationAction}
            />
            <Route path="*">
              <span></span>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default Home;
