const prisma = require("../prisma/prismaClient");
const {
  HTTP_200_SUCCESS,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../shared/utils/statusCodes");

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
module.exports = getAllFollowers;
