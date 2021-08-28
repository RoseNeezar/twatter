import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../store/hooks/useAuth";

export function PrivateRoute({ children, ...rest }: RouteProps) {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (!!user === false) {
      router.push("/");
    }
  }, [user]);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
