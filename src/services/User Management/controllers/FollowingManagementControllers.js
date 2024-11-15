const pushToQueue = require("../rmq/pushToRMQ");
const prisma = require("../prisma/prismaClient");
const {
  HTTP_200_SUCCESS,
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../shared/utils/statusCodes");

const follow = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "please provide the user id you want to follow",
      });
    }

    if (!req.headers.userid) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "please provide the follower id",
      });
    }
    if (+req.headers.userid == req.body.id) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "user can't follow himself",
      });
    }
    const followerId = +req.headers.userid;
    const followingId = req.body.id;
    pushToQueue("follow", followerId, followingId);
    return res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
      message: "Server received the request",
    });
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

const unfollow = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "please provide the user id you want to unfollow",
      });
    }
    if (!req.headers.userid) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "please provide the follower id",
      });
    }
    if (+req.headers.userid == req.body.id) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "user can't unfollow himself",
      });
    }
    const followerId = +req.headers.userid;
    const followingId = req.body.id;
    pushToQueue("unfollow", followerId, followingId);
    return res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
      message: "Server received the request",
    });
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

const getAllFollowings = async (req, res) => {
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
    res
      .status(HTTP_200_SUCCESS)
      .json({ status: "Ok", data: followingsDetails });
  } catch (err) {
    res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

const getAllFollowers = async (req, res) => {
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
    res.status(HTTP_200_SUCCESS).json({ status: "Ok", data: followerDetails });
  } catch (err) {
    res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

module.exports = { getAllFollowers, getAllFollowings, follow, unfollow };
