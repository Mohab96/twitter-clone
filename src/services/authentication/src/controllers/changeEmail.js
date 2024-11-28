const {
  HTTP_400_BAD_REQUEST,
  HTTP_403_Forbidden,
  HTTP_200_SUCCESS,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../../shared/utils/statusCodes");

const checkHash = require("../bcryptHash/checkHash");
const prisma = require("../prisma/prismaClient");

const pushToQueue = require("../rmq/pushToRMQ");

const changeEmail = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No email was provided",
      });
    }
    if (!req.body.password) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No password was provided",
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: req.payload.userid,
      },
    });
    const isMatch = await checkHash(req.body.password, user.password);
    if (!isMatch) {
      return res.status(HTTP_403_Forbidden).json({
        status: "Fail",
        message: "Password is wrong",
      });
    }
    const isMatchEmail = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (isMatchEmail) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "Email in use",
      });
    }
    await prisma.user.update({
      where: {
        id: req.payload.userid,
      },
      data: {
        email: req.body.email,
      },
    });
    await pushToQueue({
      mode: 0,
      type: "change-email",
      username: req.payload.username,
      email: req.payload.email,
    });

    res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
    });
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

module.exports = changeEmail;
