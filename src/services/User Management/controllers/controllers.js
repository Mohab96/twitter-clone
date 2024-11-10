const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
/* the auth service must provide the user id in the request body */

changeBio = async (req, res) => {
  try {
    if (req.body.bio === undefined) {
      return res.status(400).json({
        status: "Fail",
        message: "No bio was provided.",
      });
    }
    if (!req.body.id) {
      return res.status(400).json({
        status: "Fail",
        message: "No id was provided.",
      });
    }
    const result = await prisma.user.update({
      where: {
        id: +req.body.id,
      },
      data: {
        bio: req.body.bio,
      },
    });
    if (!result) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }
    return res.status(200).json({ status: "Ok", data: result });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      error: err,
    });
  }
};
changeUsername = async (req, res) => {
  try {
    const newUsername = req.body.username;
    if (!newUsername) {
      return res.status(400).json({
        status: "Fail",
        message: "No username was provided",
      });
    }
    if (!req.body.id) {
      return res.status(400).json({
        status: "Fail",
        message: "No id was provided",
      });
    }
    const result = await prisma.user.findFirst({
      where: {
        user_name: newUsername,
      },
    });
    if (result) {
      return res.status(400).json({
        status: "Fail",
        message: "Username already in use",
      });
    }
    await prisma.user.update({
      where: {
        id: +req.body.id,
      },
      data: {
        user_name: newUsername,
      },
    });
    return res.status(200).json({
      status: "Ok",
      data: newUsername,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      error: err,
    });
  }
};
getAllFollowers = async (req, res) => {};
getProfile = async (req, res) => {
  /* add the cover image and the profile image to the response */
  try {
    const userId = +req.params.id;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        followers_cnt: true,
        following_cnt: true,
        bio: true,
        user_name: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "Ok",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      error: err,
    });
  }
};
changeProfilePic = async (req, res) => {};
changeCoverPic = async (req, res) => {};

module.exports = {
  changeBio,
  changeCoverPic,
  changeProfilePic,
  changeUsername,
  getAllFollowers,
  getProfile,
};
