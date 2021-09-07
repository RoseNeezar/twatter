import { createBrowserHistory, History } from "history";
import { routeChange } from "../store/module/auth/auth.slice";
import { store } from "../store/store";

let Navigate: History | undefined;

if (typeof document !== "undefined") {
  Navigate = createBrowserHistory({
    basename: "/app",
  });

  Navigate.listen((location: any) => {
    return store.dispatch(routeChange(location));
  });
}

export default Navigate;
