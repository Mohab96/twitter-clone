const express = require("express");
const multer = require("multer");
const {
  changeBio,
  changeUsername,
  getProfile,
  changeCoverPic,
  changeProfilePic,
  getProfilePic,
  getAllFollowers,
  getAllFollowings,
} = require("../controllers/controllers");

const router = express.Router();
router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/bio", changeBio);
router.get("/profile", getProfile);
router.post("/profile-pic", upload.single("file"), changeProfilePic);
router.post("/cover-pic", upload.single("file"), changeCoverPic);
router.post("/username", changeUsername);
router.get("/profile-pic/:id", getProfilePic); // return the profile pic of an account
router.get("/cover-pic/:id", getCoverPic); // return the cover pic of an account
router.post("/follow"); // follow a user
router.delete("/follow"); // unfollow a user
router.get("/followers/:id", getAllFollowers); // returns a list of followers for a specific user
router.get("/followings/:id", getAllFollowings); // returns a list of followings for a specific user

module.exports = router;
