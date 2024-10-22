const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const storeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "Fail",
        message: "No File Uploaded.",
      });
    }
    const Path = "uploads/" + req.file.filename;
    const newFile = await prisma.file.create({
      data: {
        path: Path,
      },
    });
    return res.status(200).json({
      status: "Ok",
      id: newFile.id,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({
      status: "Error",
      message: "Error uploading files",
    });
  }
};
module.exports = { storeFile };
