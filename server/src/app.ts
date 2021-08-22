import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import AuthRoute from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    expires: new Date(Date.now() + Number(process.env.JWT_EXPIRATION_TIME)),
  })
);

app.use("/api/auth", AuthRoute);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
