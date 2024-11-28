require("dotenv").config();

const { establishRMQConnection } = require("./src/rmq/establishRMQConnection");
const consume = require("./src/rmq/rmqConsumerServer");

async function runServer() {
  await establishRMQConnection();
  consume();
}

runServer();
