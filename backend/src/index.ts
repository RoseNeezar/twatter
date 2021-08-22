import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.listen(3010, () => {
  console.log("on port 3010");
});
