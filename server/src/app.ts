import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

// app.use(currentUserRouter);
// app.use(signinRouter);
// app.use(signoutRouter);
// app.use(signupRouter);

// app.all("*", async () => {
//   throw new NotFoundError();
// });
// app.use(errorHandler);
// if (!process.env.JWT_KEY) {
//   throw new Error("JWT_KEY must be defined");
// }

export { app };
