const express = require("express");
const multer = require("multer");
const {
  changeBio,
  changeUsername,
  getProfile,
} = require("../controllers/Usercontrollers");
const {
  follow,
  unfollow,
  getAllFollowers,
  getAllFollowings,
} = require("../controllers/FollowingManagementControllers");
const {
  changeCoverPic,
  changeProfilePic,
  getProfilePic,
  getCoverPic,
} = require("../controllers/UserPicsControllers");
const router = express.Router();
router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/bio", changeBio);
router.get("/profile", getProfile);
router.post("/profile-pic", upload.single("file"), changeProfilePic);
router.post("/cover-pic", upload.single("file"), changeCoverPic);
router.post("/username", changeUsername);
router.get("/profile-pic/:id", getProfilePic);
router.get("/cover-pic/:id", getCoverPic);
router.post("/follow", follow);
router.delete("/follow", unfollow);
router.get("/followers/:id", getAllFollowers);
router.get("/followings/:id", getAllFollowings);

module.exports = router;
