const path = require("path");
const fs = require("fs");
const prisma = require("../prisma/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_201_CREATED,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_404_NOT_FOUND,
  HTTP_202_Accepted,
  HTTP_102_Processing,
  HTTP_200_SUCCESS,
} = require("../../../shared/utils/statusCodes");
const pushToQueue = require("../rmq/pushToRMQ");

const storeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No File Uploaded.",
      });
    }
    req.file.originalname = Date.now() + path.extname(req.file.originalname);
    const Path = "uploads/" + req.file.originalname;
    const newFile = await prisma.file.create({
      data: {
        path: Path,
      },
    });
    res.status(HTTP_201_CREATED).json({
      status: "Ok",
      id: newFile.id,
    });
    await pushToQueue(req.file.buffer, req.file, newFile.id);
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      message: "Error uploading files",
    });
  }
};

const sendFile = async (req, res) => {
  try {
    if (!req.params.fileId) {
      return res
        .status(HTTP_400_BAD_REQUEST)
        .json({ status: "Fail", message: "File ID is not provided" });
    }
    const fileId = +req.params.fileId;
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
      },
    });
    if (!file) {
      return res.status(HTTP_404_NOT_FOUND).json({
        status: "Fail",
        message: "File Not Found",
      });
    }
    if (file.status === "In Queue") {
      return res
        .status(HTTP_202_Accepted)
        .json({ status: "Ok", messae: "File is still in queue." });
    }
    if (file.status === "In progress") {
      return res
        .status(HTTP_102_Processing)
        .json({ status: "Ok", messae: "File is under processing" });
    }
    if (file.status === "Failed") {
      return res
        .status(HTTP_200_SUCCESS)
        .json({ status: "Ok", messae: "File failed to be processed" });
    }
    const FilePath = file.path;
    var uploadDir = path.join(__dirname, "../" + FilePath);
    fs.access(uploadDir, fs.constants.F_OK, (err) => {
      if (err) {
        return res
          .status(HTTP_404_NOT_FOUND)
          .json({ status: "Fail", message: "File not found" });
      }
      res.download(uploadDir, (err) => {
        if (err) {
          return res
            .status(HTTP_500_INTERNAL_SERVER_ERROR)
            .json({ status: "Error", message: err });
        }
      });
    });
  } catch (error) {
    res
      .status(HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: "Error", message: error });
  }
};
module.exports = { storeFile, sendFile };
