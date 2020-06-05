const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  addProfile,
  getProfile,
  getprofiles,
  getuserprofile,
  deleteuserprofile,
  experience,
  education,
  deleteexprience,
  deleteEducation,
  getgitRepos,
} = require("../controllers/profileController");
const auth = require("../middleware/auth");

// @desc  get user profile
router.get("/", auth, getProfile);

// create user profile
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  addProfile
);

// get user profile
router.get("/allprofiles", getprofiles);

// get profile by user id
router.get("/user/:user_id", getuserprofile);

// @desc Delete user,profile and post
router.delete("/user/:user_id", auth, deleteuserprofile);

// @desc add user experience to the profile
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("location", "Location is required").not().isEmpty(),
      check("from", "Date of start is required").not().isEmpty(),
    ],
  ],
  experience
);
// delete profile experience
router.delete("/experience/:exp_id", auth, deleteexprience);

// @desc add user education to the profile
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldOfStudy", "fieldOfStudy is required").not().isEmpty(),
      check("from", "Date of start is required").not().isEmpty(),
    ],
  ],
  education
);

// delete profile education
router.delete("/education/:educ_id", auth, deleteEducation);

// get user gitRepo
router.get("/github/:username", getgitRepos);
module.exports = router;
