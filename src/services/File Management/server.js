require("dotenv").config();
const express = require("express");
const consume = require("./rmq/rmqConsumerServer");
const connectToDB = require("./prisma/connectToDB");
const fileRoutes = require("./routes/filesRoutes");
const {
  establishRMQConnection,
  getChannel,
  getConnection,
} = require("./rmq/establishRMQConnection");
const fs = require("fs");
const app = express();
app.use(express.json());

app.use("/api/file", fileRoutes);

app.listen(process.env.PORT, async () => {
  console.log("[!] server is running on port:", process.env.PORT || 3000);
  const uploadDir = "uploads";
  if (!fs.existsSync(uploadDir)) {
    console.log("[!] uploads folder does not exist, creating one...");
    fs.mkdirSync(uploadDir);
  } else {
    console.log("[!] uploads folder already exists.");
  }
  connectToDB();
  await establishRMQConnection();
  consume();
});

process.on("SIGINT", async () => {
  console.log("\nShutting down...\n");
  if (getChannel()) {
    console.log("[!] Closing RMQ Channels.\n");
    await getChannel().close();
  }
  if (getConnection()) {
    console.log("[!] Closing RMQ Connections.");
    await getConnection().close();
  }
  process.exit(0);
});
