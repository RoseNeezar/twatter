import express from "express";
import { body } from "express-validator";
import {
  getCurrentUser,
  login,
  logout,
  signUp,
} from "../controller/AuthController";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { validateRequest } from "../middlewares/validator-request.middleware";

const AuthRoute = express.Router();

AuthRoute.route("/login").post(
  [body("email").isEmail().withMessage("Email must be valid")],
  validateRequest,
  login
);

AuthRoute.route("/signup").post(
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20"),
    body("firstName")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20"),
    body("lastName")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20"),
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20"),
  ],
  validateRequest,
  signUp
);

AuthRoute.route("/logout").post(logout);

AuthRoute.route("/current-user").get(currentUser, requireAuth, getCurrentUser);

export default AuthRoute;
