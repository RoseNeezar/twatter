import { createBrowserHistory, History } from "history";

let Navigate: History | undefined;

if (typeof document !== "undefined") {
  Navigate = createBrowserHistory({
    basename: "/app",
  });
}

export default Navigate;
