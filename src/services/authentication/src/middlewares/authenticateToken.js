const jwt = require("jsonwebtoken");
const {
  HTTP_403_Forbidden,
  HTTP_401_UNAUTHORIZED,
} = require("../../../../shared/utils/statusCodes");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; //[Bearer, Token]
  if (token == null) {
    return res.status(HTTP_401_UNAUTHORIZED).json({
      status: "Fail",
      message: "No access token was provided",
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(HTTP_403_Forbidden).json({
        status: "Unauthorized",
        message: "Acess token is not valid",
      });
    }
    req.payload = payload;
    next();
  });
}

module.exports = authenticateToken;
