const amqp = require("amqplib");
const prisma = require("../prisma/prismaClient");
const RMQURL = process.env.RMQURL;

async function pushToQueue(buffer, fileInfo, id) {
  try {
    const connection = await amqp.connect(RMQURL);
    const channel = await connection.createChannel();
    await channel.assertQueue("files", { durable: true });
    const message = {
      buffer: buffer,
      fileName: fileInfo.originalname,
      fileId: id,
    };
    await channel.sendToQueue("files", Buffer.from(JSON.stringify(message)));
    console.log("[!] Message pushed to files queue", message);
    await channel.close();
    await connection.close();
  } catch (err) {
    try {
      await prisma.file.update({
        where: {
          id: id,
        },
        data: {
          status: "Failed",
        },
      });
    } catch (err) {
      console.log("[!] Error happened with the database", err);
    }
    console.log("[!] Error happend, message did not sent to the queue", err);
  }
}

module.exports = pushToQueue;
