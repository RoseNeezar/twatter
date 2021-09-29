import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import LoadingPage from "./components/Loading/LoadingPage";
import Home from "./PageComponent/Home/Home";
import { useAppDispatch, useAppSelector } from "./store/hooks/hooks";
import { getUser } from "./store/module/auth/auth.slice";
import { RootState } from "./store/store";
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
      <Route path="/">
        <Home />
      </Route>
    </>
  );
};

export default App;
