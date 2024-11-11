const express = require("express");
const multer = require("multer");
const {
  changeBio,
  changeUsername,
  getProfile,
  changeCoverPic,
  changeProfilePic,
} = require("../controllers/controllers");

const router = express.Router();
router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/bio", changeBio);
router.get("/profile/:id", getProfile);
router.post("/avatar", upload.single("file"), changeProfilePic);
router.post("/cover", upload.single("file"), changeCoverPic);
router.post("/username", changeUsername);
router.post("/follow"); // follow a user
router.delete("/follow"); // unfollow a user
router.get("/followers/:id"); // returns a list of followers for a specific user
router.get("/following/:id"); // returns a list of followings for a specific user

module.exports = router;
