import React, { useLayoutEffect } from "react";
import Navigate from "../../utils/Navigate";

const RedirectHome = () => {
  useLayoutEffect(() => {
    Navigate?.push("/home");
  }, []);

  return <div>Loading...</div>;
};

export default RedirectHome;
