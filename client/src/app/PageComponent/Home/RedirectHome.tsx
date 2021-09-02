import React, { useEffect, useLayoutEffect } from "react";
import Navigate from "../../utils/Navigate";

const RedirectHome = () => {
  useLayoutEffect(() => {
    Navigate?.push("/home");
  }, [Navigate]);

  return <div>Loading...</div>;
};

export default RedirectHome;
