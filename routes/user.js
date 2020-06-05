const express = require("express");
const router = express.Router();
const { register } = require("../controllers/userControler");
const { check } = require("express-validator");

// @desc  register Users
router.post(
  "/",
  check("firstname", "Please enter firstname").not().isEmpty(),
  check("lastname", "PLease enter lastname").not().isEmpty(),
  check("email", "Please enter valid email").isEmail(),
  check(
    "password",
    "Please enter password with 6 or ore charaacters"
  ).isLength({ min: 6 }),

  register
);

module.exports = router;
