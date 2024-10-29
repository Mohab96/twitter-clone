const express = require("express");
const multer = require("multer");
const path = require("path");
const { storeFile, sendFile } = require("../controllers/filesControllers");
const { HTTP_400_BAD_REQUEST } = require("../../../shared/utils/statusCodes");
const router = express.Router();
router.use(express.json());
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, //TODO should be adjusted later
  },
});
router.post("/upload", upload.single("file"), storeFile);
// handle multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "File size is too large",
      });
    }
    return res.status(HTTP_400_BAD_REQUEST).json({
      status: "Fail",
      message: error.message,
    });
  }
  next(error);
});

router.get("/download/:fileId", sendFile);

module.exports = router;
