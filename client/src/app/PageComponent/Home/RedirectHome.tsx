import React, { useLayoutEffect } from "react";
import Navigate from "../../utils/Navigate";

const RedirectHome = () => {
  console.log("redirect");
  useLayoutEffect(() => {
    Navigate?.push("/home");
  }, []);
  return <div>Loading...</div>;
};

export default RedirectHome;
