import express from "express";
import { body } from "express-validator";
import { login } from "../controller/AuthController";
import { validateRequest } from "../validator/auth.validator";

const AuthRoute = express.Router();

AuthRoute.route("/login").post(
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  login
);

export default AuthRoute;
