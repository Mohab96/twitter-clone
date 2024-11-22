const prisma = require("../prisma/prismaClient");
const axios = require("axios");
const {
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../shared/utils/statusCodes");
const getCoverPic = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: +req.params.id,
      },
      select: {
        cover_pic: true,
      },
    });
    if (!user.cover_pic) {
      return res.status(HTTP_400_BAD_REQUEST).json({
        status: "Fail",
        message: "User not found or user doesn't have a cover image",
      });
    }
    const image = await axios({
      method: "get",
      url: process.env.FILE_SERVICE + `/download/${user.cover_pic}`,
      responseType: "stream",
    });
    res.setHeader("Content-Type", image.headers["content-type"]);
    res.setHeader("Content-Disposition", image.headers["content-disposition"]);
    image.data.pipe(res);
  } catch (err) {
    return res.status(HTTP_500_INTERNAL_SERVER_ERROR).json({
      status: "Error",
      error: err,
    });
  }
};
module.exports = getCoverPic;
