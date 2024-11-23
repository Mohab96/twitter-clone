const path = require("path");
const fs = require("fs");
const prisma = require("../prisma/prismaClient");
const uploadDir = path.join(__dirname, "../uploads");
const { getChannel } = require("../rmq/establishRMQConnection");
async function saveFileToDisk(fileBuffer, filename, fileId) {
  try {
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, fileBuffer);
    console.log(`[!] File saved to disk: ${filePath}`);
    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        status: "Ok",
      },
    });
  } catch (err) {
    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        status: "Failed",
      },
    });
    console.log(err);
  }
}
async function consume() {
  const channel = getChannel();
  console.log("[!] Waiting for messages in queue...");
  channel.consume("files", async (message) => {
    if (message !== null) {
      const content = JSON.parse(message.content.toString());
      const { buffer, fileName, fileId } = content;
      await prisma.file.update({
        where: {
          id: fileId,
        },
        data: {
          status: "In progress",
        },
      });
      const fileBuffer = Buffer.from(buffer.data);
      saveFileToDisk(fileBuffer, fileName, fileId);
      channel.ack(message);
    }
  });
}

module.exports = consume;
