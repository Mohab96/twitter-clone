const prisma = require("../prisma/prismaClient");
const axios = require("axios");
const FormData = require("form-data");
const {
  HTTP_201_CREATED,
  HTTP_400_BAD_REQUEST,
  HTTP_500_INTERNAL_SERVER_ERROR,
} = require("../../../shared/utils/statusCodes");
const changeCoverPic = async (req, res) => {
  if (!req.file) {
    return res
      .status(HTTP_400_BAD_REQUEST)
      .json({ status: "Fail", message: "No image uploaded." });
  }
  if (!req.headers.userid) {
    return res
      .status(HTTP_400_BAD_REQUEST)
      .json({ status: "Fail", message: "User id is not provided." });
  }
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      process.env.FILE_SERVICE + "/upload",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    await prisma.user.update({
      where: {
        id: +req.headers.userid,
      },
      data: {
        cover_pic: response.data.id,
      },
    });
    res.status(HTTP_201_CREATED).json({
      status: "Ok",
      message: "Cover image updated",
    });
  } catch (err) {
    res
      .status(HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: "Error", error: err });
  }
};
module.exports = changeCoverPic;
