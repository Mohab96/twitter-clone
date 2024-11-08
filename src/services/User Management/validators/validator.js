const joi = require("joi");

const schema = joi.object({
  username: joi.string().alphanum().min(1).max(40).required(),
  first_name: joi.string().min(1).max(40).required(),
  last_name: joi.string().min(1).max(40).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().alphanum().min(8).required(),
  age: joi.number().required(),
});

module.exports = { schema };
