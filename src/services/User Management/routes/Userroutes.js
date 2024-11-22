const express = require("express");
const multer = require("multer");
const changeBio = require("../controllers/changeBio");
const changeUsername = require("../controllers/changeUsername");
const getProfile = require("../controllers/getProfile");
const getAllFollowers = require("../controllers/getAllFollowers");
const follow = require("../controllers/follow");
const unfollow = require("../controllers/unfollow");
const getAllFollowings = require("../controllers/getAllFollowings");
const changeCoverPic = require("../controllers/changeCoverPic");
const changeProfilePic = require("../controllers/changeProfilePic");
const getProfilePic = require("../controllers/getProfile");
const getCoverPic = require("../controllers/getCoverPic");
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
