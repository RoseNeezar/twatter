import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../store/hooks/useAuth";
import Navigate from "./Navigate";

export function ReRoute({ children, ...rest }: RouteProps) {
  useEffect(() => {
    Navigate?.push("/home");
  }, []);
  return <Route {...rest} render={({ location }) => children} />;
}
