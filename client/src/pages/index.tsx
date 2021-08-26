import React from "react";
import { FC } from "react";
import { Router } from "react-router-dom";

import Navigate from "../app/utils/Navigate";
import App from "../app/PageComponent/App";
import { Provider } from "react-redux";
import { store } from "../app/store/store";

const SafeHydrate: FC = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      {typeof document === "undefined" ? null : children}
    </div>
  );
};

const Index: FC = () => {
  return (
    <SafeHydrate>
      <Provider store={store}>
        <Router history={Navigate!}>
          <App />
        </Router>
      </Provider>
    </SafeHydrate>
  );
};

export default Index;
