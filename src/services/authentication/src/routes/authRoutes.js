const express = require("express");
const authRouter = express.Router();
authRouter.use(express.json());
// controllers
const { checkToken } = require("../controllers/checkToken");

// routes
authRouter.get("/check-route", checkToken);

module.exports = authRouter;
