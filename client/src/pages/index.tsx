import React from "react";
import { FC } from "react";
import { Router } from "react-router-dom";

import Navigate from "../app/utils/Navigate";
import App from "../app/PageComponent/App";

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
      <Router history={Navigate!}>
        <App />
      </Router>
    </SafeHydrate>
  );
};

export default Index;
