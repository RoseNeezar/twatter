import { useEffect } from "react";
import { Route, RouteProps } from "react-router-dom";
import Navigate from "./Navigate";

export function ReRoute({ children, ...rest }: RouteProps) {
  useEffect(() => {
    Navigate?.push("/home");
  }, []);
  return <Route {...rest} render={({ location }) => children} />;
}
