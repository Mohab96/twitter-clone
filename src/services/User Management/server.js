require("dotenv").config();
const {
  establishRMQConnection,
  getChannel,
  getConnection,
} = require("./rmq/establishRMQConnection");
const express = require("express");
const connectToDB = require("./prisma/connectToDB");
const app = express();
const userRoutes = require("./routes/Userroutes");
app.use(express.json());
const consume = require("./rmq/rmqConsumerServer");

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, async () => {
  console.log("[!] server is running on port:", process.env.PORT);
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
