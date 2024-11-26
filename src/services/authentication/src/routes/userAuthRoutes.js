const express = require("express");
const userAuthRouter = express.Router();
userAuthRouter.use(express.json());

/// controllers
const login = require("../controllers/login");
const changePassword = require("../controllers/changePasword");
const authenticateToken = require("../middlewares/authenticateToken");
const changeEmail = require("../controllers/changeEmail");
const signup = require("../controllers/signup");

/// middlewares
const passwordValidator = require("../middlewares/validateUserPassword");
const userValidator = require("../middlewares/validateUserForm");
const emailValidator = require("../middlewares/validateUserEmail");

// routes
userAuthRouter.post("/login", login);
userAuthRouter.post("/sign-up", userValidator, signup);
userAuthRouter.post(
  "/change-password",
  authenticateToken,
  passwordValidator,
  changePassword
);
userAuthRouter.post(
  "/change-email",
  authenticateToken,
  emailValidator,
  changeEmail
);

/// todo: implement delete-user route

module.exports = userAuthRouter;
