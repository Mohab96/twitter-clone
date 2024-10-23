const express = require("express");
const multer = require("multer");
const path = require("path");
const { storeFile, sendFile } = require("../controllers/filesControllers");
const router = express.Router();
router.use(express.json());
const uploadDir = path.join(__dirname, "../uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB limit
  },
});
router.post("/upload", upload.single("file"), storeFile);
// handle multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "Fail",
        message: "File size is too large",
      });
    }
    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
  next(error);
});

router.get("/download/:fileId", sendFile);

module.exports = router;
