const express = require("express");
const router = express.Router();
const { getcurrentUser, loginUser } = require("../controllers/authController");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// @dec authenticate user and send a token
router.post(
  "/login",
  check("email", "Please enter valid email").isEmail(),
  check("password", "Password is required").exists(),
  loginUser
);

// @dec get currently logged in user
router.get("/me", auth, getcurrentUser);

module.exports = router;
