const amqp = require("amqplib");
let connection;
let channel;
const establishRMQConnection = async () => {
  try {
    connection = await amqp.connect(process.env.RMQURL);
    console.log("[!] Connected to RMQ.");
    channel = await connection.createChannel();
    console.log("[!] RMQ Channel Created.");
    await channel.assertQueue("emails", { durable: true });
    console.log("[!] Queue asserted");
  } catch (error) {
    console.error("Error initializing RabbitMQ:", error);
    process.exit(1);
  }
};

const getConnection = () => {
  return connection;
};

const getChannel = () => {
  return channel;
};
module.exports = { getConnection, getChannel, establishRMQConnection };
