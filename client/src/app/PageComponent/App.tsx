import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import Home from "./Home/Home";

const App = () => {
  return (
    <>
      <Route
        render={() => (
          <>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/register" component={RegisterPage} />
              <Route path="/" component={Home} />
            </Switch>
          </>
        )}
      />
    </>
  );
};

export default App;
