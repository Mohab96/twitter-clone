const express = require("express");
const consume = require("./rmq/rmqConsumerServer");
const connectToDB = require("./prisma/connectToDB");
const app = express();
require("dotenv").config();
const userRoutes = require("./routes/Userroutes");
app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("[!] server is running on port:", process.env.PORT || 3000);
  connectToDB();
  consume();
});
