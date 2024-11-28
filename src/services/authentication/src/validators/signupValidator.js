const joi = require("joi");

const userSchema = joi.object({
  username: joi
    .string()
    .min(1)
    .max(40)
    .messages({
      "string.empty": "Username is required.",
      "string.min": "Username should have at least 1 characters.",
      "string.max": "Username should not exceed 40 characters.",
    })
    .required(),
  first_name: joi
    .string()
    .min(1)
    .max(40)
    .messages({
      "string.empty": "First Name is required.",
      "string.min": "First Name should have at least 1 characters.",
      "string.max": "First Name should not exceed 40 characters.",
    })
    .required(),
  last_name: joi
    .string()
    .min(1)
    .max(40)
    .messages({
      "string.empty": "Last Name is required.",
      "string.min": "Last Name should have at least 1 characters.",
      "string.max": "Last Name should not exceed 40 characters.",
    })
    .required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi
    .string()
    .alphanum()
    .min(8)
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password should have at least 8 characters.",
    })
    .required(),
  age: joi.number().required().max(117).messages({
    "number.empty": "age is required.",
    "number.max": "age should not exceed 117.",
  }),
  date_of_birth: joi.date(),
  bio: joi.string(),
  phone_number: joi.string(),
});

module.exports = { userSchema };
