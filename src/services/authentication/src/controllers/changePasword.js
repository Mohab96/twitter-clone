const prisma = require("../prisma/prismaClient");
const hashPassword = require("../bcryptHash/generateHash");

const {
  HTTP_201_CREATED,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../../shared/utils/statusCodes");

const changePassword = async (req, res) => {
  try {
    const password = req.body.password;
    const username = req.payload.username;
    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: {
        user_name: username,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.status(HTTP_201_CREATED).json({
      status: "Ok",
    });
    /// todo: send email to the email address [emailing service]
  } catch (error) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      staus: "Error",
      error: error,
    });
  }
};
module.exports = changePassword;
