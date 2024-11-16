const express = require("express");
const consume = require("./rmq/rmqConsumerServer");
const connectToDB = require("./prisma/connectToDB");
const fileRoutes = require("./routes/filesRoutes");
require("dotenv").config();
const fs = require("fs");
const app = express();
app.use(express.json());

app.use("/api/file", fileRoutes);

app.listen(process.env.PORT, () => {
  console.log("[!] server is running on port:", process.env.PORT || 3000);
  const uploadDir = "uploads";
  if (!fs.existsSync(uploadDir)) {
    console.log("[!] uploads folder does not exist, creating one...");
    fs.mkdirSync(uploadDir);
  } else {
    console.log("[!] uploads folder already exists.");
  }
  connectToDB();
  consume();
});
