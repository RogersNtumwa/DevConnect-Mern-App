const User = require("../models/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route GET api/v1/user/me
// @desc  get currently logged in user
// @access Private
exports.getcurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route GET api/v1/user/loggin
// @desc  login user /Authenticate User and get token
// @access Public
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check if User already exists
    let user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecrete"),
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
