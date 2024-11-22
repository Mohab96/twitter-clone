const prisma = require("../prisma/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_200_SUCCESS,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../shared/utils/statusCodes");
/* the auth service must provide the user id in the request headers */
const changeUsername = async (req, res) => {
  try {
    const newUsername = req.body.username;
    if (!newUsername) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No username was provided",
      });
    }
    if (!req.headers.userid) {
      return res.status(HTTP_400_BAD_REQUEST).json({
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
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "Username already in use",
      });
    }
    await prisma.user.update({
      where: {
        id: +req.headers.userid,
      },
      data: {
        user_name: newUsername,
      },
    });
    return res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
      data: {
        username: newUsername,
      },
    });
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};
module.exports = changeUsername;
