const { getChannel } = require("../rmq/establishRMQConnection");
const pushToQueue = async (state, followerId, followingId) => {
  const channel = getChannel();
  try {
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
  } catch (err) {
    throw new Error(
      `Error happened while trying to push the message to the following-management queue: ${err}`
    );
  }
};

module.exports = pushToQueue;
