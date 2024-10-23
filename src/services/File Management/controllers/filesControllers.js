const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");
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

const sendFile = async (req, res) => {
  try {
    const fileId = +req.params.fileId;
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });
    if (!file) {
      return res.status(404).json({
        status: "Fail",
        message: "File Not Found",
      });
    }
    const FilePath = file.path;
    var uploadDir = path.join(__dirname, "../" + FilePath);

    /// TODO: change mime type to [png, jpeg, jpg, gif]
    res.setHeader("Content-Type", "image/png");
    const stream = fs.createReadStream(uploadDir);
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ status: "Error", message: error });
  }
};
module.exports = { storeFile, sendFile };
