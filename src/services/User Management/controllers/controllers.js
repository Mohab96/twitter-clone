const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const e = require("express");
const FormData = require("form-data");
const prisma = new PrismaClient();
/* the auth service must provide the user id in the request headers */

changeBio = async (req, res) => {
  try {
    if (req.body.bio === undefined) {
      return res.status(400).json({
        status: "Fail",
        message: "No bio was provided.",
      });
    }
    if (!req.id) {
      return res.status(400).json({
        status: "Fail",
        message: "No id was provided.",
      });
    }
    const result = await prisma.user.update({
      where: {
        id: +req.id,
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
getAllFollowers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const followers = await prisma.follower.findMany({
      where: {
        following_id: +req.params.id,
      },
      select: {
        follower: {
          select: {
            first_name: true,
            last_name: true,
            user_name: true,
            bio: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const followerDetails = followers.map((f) => f.follower);
    res.status(200).json({ status: "Ok", data: followerDetails });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      error: err,
    });
  }
};
getProfile = async (req, res) => {
  const { email, username, id } = req.body;
  const whereClause = email
    ? { email }
    : username
    ? { user_name: username }
    : id
    ? { id }
    : null;
  if (!whereClause) {
    return res.status(400).json({
      status: "Fail",
      message: "Please provide an email, username, or id.",
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: whereClause,
      select: {
        first_name: true,
        last_name: true,
        email: true,
        followers_cnt: true,
        following_cnt: true,
        bio: true,
        user_name: true,
        date_of_birth: true,
        created_at: true,
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
getProfilePic = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: +req.params.id,
      },
      select: {
        profile_pic: true,
      },
    });
    if (!user.profile_pic) {
      return res.status(400).json({
        status: "Fail",
        message: "User not found or user doesn't have a profile image",
      });
    }
    const image = await axios({
      method: "get",
      url: process.env.FILE_SERVICE + `/download/${user.profile_pic}`,
      responseType: "stream",
    });
    res.setHeader("Content-Type", image.headers["content-type"]);
    res.setHeader("Content-Disposition", image.headers["content-disposition"]);
    image.data.pipe(res);
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      error: err,
    });
  }
};
getCoverPic = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: +req.params.id,
      },
      select: {
        cover_pic: true,
      },
    });
    if (!user.cover_pic) {
      return res.status(400).json({
        status: "Fail",
        message: "User not found or user doesn't have a cover image",
      });
    }
    const image = await axios({
      method: "get",
      url: process.env.FILE_SERVICE + `/download/${user.cover_pic}`,
      responseType: "stream",
    });
    res.setHeader("Content-Type", image.headers["content-type"]);
    res.setHeader("Content-Disposition", image.headers["content-disposition"]);
    image.data.pipe(res);
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      error: err,
    });
  }
};
changeProfilePic = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "Fail", message: "No image uploaded." });
  }
  if (!req.id) {
    return res
      .status(400)
      .json({ status: "Fail", message: "User id is not provided." });
  }
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      process.env.FILE_SERVICE + "/upload",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    await prisma.user.update({
      where: {
        id: +req.id,
      },
      data: {
        profile_pic: response.data.id,
      },
    });
    res.status(201).json({
      status: "Ok",
      message: "Profile image updated",
    });
  } catch (err) {
    res.status(500).json({ status: "Error", error: err });
  }
};
changeCoverPic = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "Fail", message: "No image uploaded." });
  }
  if (!req.id) {
    return res
      .status(400)
      .json({ status: "Fail", message: "User id is not provided." });
  }
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      process.env.FILE_SERVICE + "/upload",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    await prisma.user.update({
      where: {
        id: +req.id,
      },
      data: {
        cover_pic: response.data.id,
      },
    });
    res.status(201).json({
      status: "Ok",
      message: "Cover image updated",
    });
  } catch (err) {
    res.status(500).json({ status: "Error", error: err });
  }
};
getAllFollowings = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const followings = await prisma.follower.findMany({
      where: {
        follower_id: +req.params.id,
      },
      select: {
        following: {
          select: {
            first_name: true,
            last_name: true,
            user_name: true,
            bio: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const followingsDetails = followings.map((f) => f.following);
    res.status(200).json({ status: "Ok", data: followingsDetails });
  } catch (err) {
    res.status(500).json({
      status: "Error",
      error: err,
    });
  }
};
module.exports = {
  changeBio,
  changeCoverPic,
  changeProfilePic,
  changeUsername,
  getAllFollowers,
  getProfile,
  getProfilePic,
  getCoverPic,
  getAllFollowings,
};
