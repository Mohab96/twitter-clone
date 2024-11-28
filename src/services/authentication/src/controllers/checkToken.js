const jwt = require("jsonwebtoken");
const protectedRoutes = require("../utils/protectedRoutes");

const {
  HTTP_401_UNAUTHORIZED,
  HTTP_403_Forbidden,
  HTTP_200_SUCCESS,
} = require("../../../../shared/utils/statusCodes");

const checkToken = (req, res) => {
  const path = req.body.path;
  const method = req.body.method;
  const result = protectedRoutes.find(
    (item) => item.method === method && item.path === path
  );
  if (!result) {
    return res.status(HTTP_200_SUCCESS).json({
      status: "Ok",
      data: { protected: false },
    });
  }
  const tokenBody = req.body.token;
  const token = tokenBody && tokenBody.split(" ")[1]; //[Bearer, Token]
  if (token == null) {
    return res.status(HTTP_401_UNAUTHORIZED).json({
      data: { protected: true },
      status: "Fail",
      message: "No access token was provided",
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(HTTP_403_Forbidden).json({
        data: { protected: true },
        status: "Unauthorized",
        message: "Acess token is not valid",
      });
    }
    return res.status(HTTP_200_SUCCESS).json({
      data: { protected: true, payload: payload },
      status: "Ok",
    });
  });
};

module.exports = { checkToken };
