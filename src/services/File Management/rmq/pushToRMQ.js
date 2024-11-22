const prisma = require("../prisma/prismaClient");
const { getChannel } = require("../rmq/establishRMQConnection");
async function pushToQueue(buffer, fileInfo, id) {
  const channel = getChannel();
  try {
    const message = {
      buffer: buffer,
      fileName: fileInfo.originalname,
      fileId: id,
    };
    await channel.sendToQueue("files", Buffer.from(JSON.stringify(message)));
    console.log("[!] Message pushed to files queue", message);
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
