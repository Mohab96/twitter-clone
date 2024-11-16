const prisma = require("../prisma/prismaClient");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_200_SUCCESS,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_404_NOT_FOUND,
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
const getProfile = async (req, res) => {
  const { email, username, id } = req.body;
  const whereClause = email
    ? { email }
    : username
    ? { user_name: username }
    : id
    ? { id }
    : null;
  if (!whereClause) {
    return res.status(HTTP_400_BAD_REQUEST).json({
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
      return res.status(HTTP_404_NOT_FOUND).json({
        status: "Fail",
        message: "User not found",
      });
    }
    return res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
      data: user,
    });
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

module.exports = {
  changeBio,
  changeUsername,
  getProfile,
};
