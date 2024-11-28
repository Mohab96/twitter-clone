const { getChannel } = require("../rmq/establishRMQConnection");
const pushToQueue = async ({
  mode,
  type,
  username,
  email,
  body,
  subject,
} = {}) => {
  const channel = getChannel();
  try {
    const message = {
      mode: mode,
      type: type,
      username: username,
      email: email,
      body: body,
      subject: subject,
    };
    await channel.sendToQueue("emails", Buffer.from(JSON.stringify(message)));
    console.log("Message pushed to emails queue", message);
  } catch (err) {
    throw new Error(
      `Error happened while trying to push the message to the emails queue: ${err}`
    );
  }
};

module.exports = pushToQueue;
