const prisma = require("./prismaClient");

const connectToDB = async () => {
  try {
    await prisma.$connect();
    console.log("[!] Connected to database successfully.");
  } catch (err) {
    console.error("[!] Unable to connect to database:", err);
    process.exit(1);
  }
};

module.exports = connectToDB;
