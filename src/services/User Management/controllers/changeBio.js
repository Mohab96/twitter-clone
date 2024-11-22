const prisma = require("../prisma/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_200_SUCCESS,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../shared/utils/statusCodes");
/* the auth service must provide the user id in the request headers */

const changeBio = async (req, res) => {
  try {
    if (req.body.bio === undefined) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No bio was provided.",
      });
    }
    if (!req.headers.userid) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No id was provided.",
      });
    }
    const result = await prisma.user.update({
      where: {
        id: +req.headers.userid,
      },
      data: {
        bio: req.body.bio,
      },
    });
    if (!result) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "User not found",
      });
    }
    return res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
      data: {
        bio: result.bio,
      },
    });
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

module.exports = changeBio;
