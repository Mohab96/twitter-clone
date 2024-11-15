const amqp = require("amqplib");

const pushToQueue = async (state, followerId, followingId) => {
  try {
    const connection = await amqp.connect(process.env.RMQURL);
    const channel = await connection.createChannel();
    await channel.assertQueue("following-management", { durable: true });
    const message = {
      state: state,
      followerId: followerId,
      followingId: followingId,
    };
    await channel.sendToQueue(
      "following-management",
      Buffer.from(JSON.stringify(message))
    );
    console.log("Message pushed to following-management queue", message);
    await channel.close();
    await connection.close();
  } catch (err) {
    throw new Error(
      `Error happened while trying to push the message to the following-management queue: ${err}`
    );
  }
};

module.exports = pushToQueue;
