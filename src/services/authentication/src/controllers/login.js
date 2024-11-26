const prisma = require("../prisma/prismaClient");
const jwt = require("jsonwebtoken");
const checkHash = require("../bcryptHash/checkHash");

const {
  HTTP_200_SUCCESS,
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_401_UNAUTHORIZED,
} = require("../../../../shared/utils/statusCodes");

const login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No username was provided",
      });
    }
    if (!password) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "No password was provided",
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        user_name: username,
      },
      select: {
        user_name: true,
        email: true,
        id: true,
        password: true,
      },
    });
    if (!user || !(await checkHash(password, user.password))) {
      return res.status(HTTP_401_UNAUTHORIZED).json({
        status: "Fail",
        message: "wrong password or username",
      });
    }
    const payload = {
      username: username,
      email: user.email,
      userid: user.id,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "60m",
    });
    res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
      data: {
        accessToken: accessToken,
      },
    });
  } catch (error) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: error,
    });
  }
};

module.exports = login;
