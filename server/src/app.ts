import express from "express";
import "express-async-errors";
import dotenv from "dotenv";

dotenv.config();

import { json } from "body-parser";
import cookieSession from "cookie-session";
import AuthRoute from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import cors from "cors";
import { NotFoundError } from "./errors/not-found-error";
import PostRoute from "./routes/post.routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    httpOnly: true,
    sameSite: "strict",
    signed: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Number(process.env.JWT_EXPIRATION_TIME),
  })
);
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(express.static("public"));

app.use("/api/auth", AuthRoute);
app.use("/api/post", PostRoute);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
