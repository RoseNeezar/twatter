import React, { FC } from "react";
import { Router } from "react-router-dom";
import App from "../app/App";
import Navigate from "../app/utils/Navigate";

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
