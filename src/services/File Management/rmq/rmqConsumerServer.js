const path = require("path");
const amqp = require("amqplib");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uploadDir = path.join(__dirname, "../uploads");
const rabbitMqUrl = process.env.RMQURL;
async function saveFileToDisk(fileBuffer, filename, fileId) {
  try {
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, fileBuffer);
    console.log(`File saved to disk: ${filePath}`);
    await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        status: "Ok",
      },
    });
  } catch (err) {
    console.log(err);
  }
}
async function consume() {
  const connection = await amqp.connect(rabbitMqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue("files", { durable: true });
  console.log("Waiting for messages in queue...");
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

consume();
