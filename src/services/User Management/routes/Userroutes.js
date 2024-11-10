const express = require("express");
const {
  changeBio,
  changeUsername,
  getAllFollowers,
  getProfile,
} = require("../controllers/controllers");
const router = express.Router();
router.use(express.json());

router.post("/bio", changeBio);
router.get("/profile/:id", getProfile);
router.post("/cover");
router.post("/username", changeUsername);
router.post("/follow"); // follow a user
router.delete("/follow"); // unfollow a user
router.get("/followers/:id", getAllFollowers); // returns a list of followers for a specific user
router.get("/following/:id"); // returns a list of followings for a specific user

module.exports = router;
