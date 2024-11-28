const { passwordSchema } = require("../validators/passwordValidator");
const {
  HTTP_400_BAD_REQUEST,
} = require("../../../../shared/utils/statusCodes");
const passwordValidator = (req, res, next) => {
  const result = passwordSchema.validate(req.body);
  if (result.error) {
    return res.status(HTTP_400_BAD_REQUEST).json({
      error: result.error.details[0].message,
    });
  }
  if (!req.value) {
    req.value = {};
  }
  next();
};

module.exports = passwordValidator;
