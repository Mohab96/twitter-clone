const { getChannel } = require("../rmq/establishRMQConnection");

const {
  send_ChangeEmail,
  send_ChangePassword,
  send_CustomEmail,
  send_SignUp,
} = require("../mailManagement/mailHelpers");

const consume = async () => {
  const channel = getChannel();
  console.log("[!] Waiting for messages in emails queue...");

  channel.consume("emails", async (message) => {
    if (message !== null) {
      try {
        const content = JSON.parse(message.content.toString());
        if (content.mode == 0) {
          const { type, email, username } = content;

          if (type === "change-email") {
            await send_ChangeEmail(email, username);
          } else if (type === "change-password") {
            await send_ChangePassword(email, username);
          } else if (type === "sign-up") {
            await send_SignUp(email, username);
          }
        } else {
          const { email, body, subject } = content;

          await send_CustomEmail(email, subject, body);
        }
        channel.ack(message);
      } catch (err) {
        console.log(`Error happened while processing email request`, err);
        channel.ack(message);
      }
    }
  });
};

module.exports = consume;
