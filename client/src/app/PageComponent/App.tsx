import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useAppDispatch } from "../store/hooks/hooks";
import { getUser } from "../store/slices/authSlice";
import { PrivateRoute } from "../utils/PrivateRoute";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import Home from "./Home/Home";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [getUser]);

  return (
    <>
      <Route
        render={() => (
          <>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/register" component={RegisterPage} />
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
