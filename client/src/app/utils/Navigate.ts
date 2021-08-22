import { createBrowserHistory, History } from "history";

let Navigate: History | undefined;

if (typeof document !== "undefined") {
  Navigate = createBrowserHistory({
    basename: "/",
  });
}

export default Navigate;
