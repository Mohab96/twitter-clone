const prisma = require("../prisma/prismaClient");
const hashPassword = require("../bcryptHash/generateHash");

const {
  HTTP_201_CREATED,
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../../shared/utils/statusCodes");

const signup = async (req, res) => {
  try {
    const isMatchEmail = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (isMatchEmail) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "Email already exists",
      });
    }
    const isMatchUsername = await prisma.user.findFirst({
      where: {
        user_name: req.body.username,
      },
    });
    if (isMatchUsername) {
      return res.status(400).json({
        status: "Fail",
        message: "username already exists",
      });
    }
    const hashedPassword = await hashPassword(req.body.password);
    await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        user_name: req.body.username,
        update_at: new Date(),
        ...(req.body.bio && { bio: req.body.bio }),
        ...(req.body.date_of_birth && {
          date_of_birth: new Date(req.body.date_of_birth),
        }),
        ...(req.body.phone_number && { phone_number: req.body.phone_number }),
      },
    });
    return res.status(HTTP_201_CREATED).json({
      status: "Ok",
      message: "User created",
    });
    /// todo: send email to the email address [emailing service]
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};

module.exports = signup;
