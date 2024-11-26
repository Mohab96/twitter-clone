const bcrypt = require("bcrypt");
const checkHash = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
module.exports = checkHash;
