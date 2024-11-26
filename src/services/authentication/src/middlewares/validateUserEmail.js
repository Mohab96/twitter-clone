const { emailSchema } = require("../validators/emailValidator");
const {
  HTTP_400_BAD_REQUEST,
} = require("../../../../shared/utils/statusCodes");
const emailValidator = (req, res, next) => {
  const result = emailSchema.validate(req.body);
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

module.exports = emailValidator;
