require("dotenv").config();
const express = require("express");
const app = express();

const connectToDB = require("./prisma/connectToDB");
const { establishRMQConnection } = require("./rmq/establishRMQConnection");

const authRouter = require("./routes/authRoutes");
const userAuthRouter = require("./routes/userAuthRoutes");

authRouter.use(express.json());

app.use("/auth", userAuthRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT, async () => {
  await connectToDB();
  await establishRMQConnection();
  console.log("[!] server is running on port:", process.env.PORT);
});
