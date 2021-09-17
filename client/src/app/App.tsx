import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import LoadingPage from "./components/Loading/LoadingPage";
import Home from "./PageComponent/Home/Home";
import { useAppDispatch, useAppSelector } from "./store/hooks/hooks";
import { getUser } from "./store/module/auth/auth.slice";
import { RootState } from "./store/store";
import { ReRoute } from "./utils/ReRoute";
import ScrollToTop from "./utils/ScrollToTop";

const App = () => {
  const dispatch = useAppDispatch();
  const appLoaded = useAppSelector((state: RootState) => state.auth.appLoaded);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (!appLoaded) return <LoadingPage />;
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
