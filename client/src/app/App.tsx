import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks/hooks";
import { getUser, isLoggedIn } from "./store/module/auth/auth.slice";
import { PrivateRoute } from "./utils/PrivateRoute";
import Home from "./PageComponent/Home/Home";
import { useRouter } from "next/dist/client/router";

const App = () => {
  const dispatch = useAppDispatch();
  const checkLogin = useAppSelector(isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    dispatch(getUser(router));
  }, [dispatch]);

  useEffect(() => {
    if (!!checkLogin) {
      router.push("/app");
    }
  }, [checkLogin]);
  return (
    <>
      <Route
        render={() => (
          <>
            <Switch>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </>
        )}
      />
    </>
  );
};

export default App;
