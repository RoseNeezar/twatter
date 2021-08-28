import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useAppDispatch } from "./store/hooks/hooks";
import { getUser } from "./store/slices/authSlice";
import { PrivateRoute } from "./utils/PrivateRoute";
import Home from "./PageComponent/Home/Home";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <>
      <Route
        render={() => (
          <>
            <Switch>
              <PrivateRoute path="/">
                <Home />
              </PrivateRoute>
            </Switch>
          </>
        )}
      />
    </>
  );
};

export default App;
