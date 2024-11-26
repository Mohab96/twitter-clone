require("dotenv").config();
const express = require("express");
const app = express();

const authRouter = require("./routes/authRoutes");
const userAuthRouter = require("./routes/userAuthRoutes");

const connectToDB = require("./prisma/connectToDB");
authRouter.use(express.json());

app.use("/auth", userAuthRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT, async () => {
  await connectToDB();
  console.log("[!] server is running on port:", process.env.PORT);
});
