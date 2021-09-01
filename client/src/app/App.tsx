import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks/hooks";
import { getUser, isLoggedIn } from "./store/module/auth/auth.slice";
import { ReRoute } from "./utils/ReRoute";
import Home from "./PageComponent/Home/Home";
import { useRouter } from "next/dist/client/router";
import ScrollToTop from "./utils/ScrollToTop";

const App = () => {
  const dispatch = useAppDispatch();
  const checkLogin = useAppSelector(isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (!!checkLogin) {
      router.push("/app");
    }
  }, [checkLogin]);
  return (
    <>
      <ScrollToTop />
      <Route
        render={() => (
          <>
            <Switch>
              <ReRoute path="/">
                <Home />
              </ReRoute>
            </Switch>
          </>
        )}
      />
    </>
  );
};

export default App;
