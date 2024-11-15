const amqp = require("amqplib");
const prisma = require("../prisma/prismaClient");
const rabbitMqUrl = process.env.RMQURL;
const consume = async () => {
  const connection = await amqp.connect(rabbitMqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue("following-management", { durable: true });

  console.log("[!] Waiting for messages in following-management queue...");

  channel.consume("following-management", async (message) => {
    if (message !== null) {
      try {
        const content = JSON.parse(message.content.toString());
        const { state, followerId, followingId } = content;
        if (state == "follow") {
          /* to ensure consistincy and data integrity */
          await prisma.$transaction([
            prisma.user.update({
              where: {
                id: followerId,
              },
              data: {
                following_cnt: {
                  increment: 1,
                },
              },
            }),
            prisma.user.update({
              where: {
                id: followingId,
              },
              data: {
                followers_cnt: {
                  increment: 1,
                },
              },
            }),
            prisma.follower.create({
              data: {
                follower_id: followerId,
                following_id: followingId,
              },
            }),
          ]);
        } else {
          /* to ensure consistincy and data integrity */
          await prisma.$transaction([
            prisma.user.update({
              where: {
                id: followerId,
              },
              data: {
                following_cnt: {
                  decrement: 1,
                },
              },
            }),
            prisma.user.update({
              where: {
                id: followingId,
              },
              data: {
                followers_cnt: {
                  decrement: 1,
                },
              },
            }),
            prisma.follower.delete({
              where: {
                follower_id_following_id: {
                  follower_id: followerId,
                  following_id: followingId,
                },
              },
            }),
          ]);
        }
        channel.ack(message);
      } catch (err) {
        console.log(
          `Error happened while processing follow/unfollow request`,
          err
        );
        channel.ack(message);
      }
    }
  });
};

module.exports = consume;
