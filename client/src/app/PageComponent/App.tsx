import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home/Home";

const App = () => {
  return (
    <>
      <Route
        render={() => (
          <>
            <Switch>
              <Route path="/" component={Home} />
            </Switch>
          </>
        )}
      />
    </>
  );
};

export default App;
