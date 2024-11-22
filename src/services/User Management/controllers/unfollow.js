const pushToQueue = require("../rmq/pushToRMQ");
const {
  HTTP_200_SUCCESS,
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../shared/utils/statusCodes");

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

module.exports = unfollow;
