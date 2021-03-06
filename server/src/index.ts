import { app } from "./app";
import mongoose from "mongoose";
import { socketServer } from "./socket/socket";

const start = async () => {
  try {
    await mongoose.connect("mongodb://root:example@mongo:27017", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
  }
  const server = app.listen(5000, () => {
    console.log("Listening on port 3000 !");
  });

  socketServer(server);
};

start();
