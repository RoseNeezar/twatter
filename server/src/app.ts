import express from "express";
import "express-async-errors";
import dotenv from "dotenv";

dotenv.config();

import { json } from "body-parser";
import AuthRoute from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import cors from "cors";
import { NotFoundError } from "./errors/not-found-error";
import PostRoute from "./routes/post.routes";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/user.routes";
import bodyParser from "body-parser";
import ChatsRoute from "./routes/chats.routes";
import MessageRoute from "./routes/message.routes";

const app = express();
app.set("trust proxy", true);
app.use(json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(express.static("public"));

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);
app.use("/api/chats", ChatsRoute);
app.use("/api/message", MessageRoute);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
