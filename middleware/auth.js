const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header("auth-token");
  // Check token
  if (!token)
    return res.status(401).json({ msg: "No token , Authorization denied" });

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecrete"));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
