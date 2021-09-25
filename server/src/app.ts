import bodyParser, { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler.middleware";
import AuthRoute from "./routes/auth.routes";
import ChatsRoute from "./routes/chats.routes";
import MessageRoute from "./routes/message.routes";
import NotificationRoute from "./routes/notification.routes";
import PostRoute from "./routes/post.routes";
import UserRoute from "./routes/user.routes";

dotenv.config();

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
app.use("/api/notification", NotificationRoute);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
