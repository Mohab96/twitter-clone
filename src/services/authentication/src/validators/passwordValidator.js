const joi = require("joi");

const passwordSchema = joi.object({
  password: joi
    .string()
    .alphanum()
    .min(8)
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password should have at least 8 characters.",
    })
    .required(),
});

module.exports = { passwordSchema };
