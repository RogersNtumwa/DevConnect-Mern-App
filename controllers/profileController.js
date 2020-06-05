const Profile = require("../models/Profile");
const User = require("../models/User");
const Post = require("../models/Post");
const { validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

// @route GET api/v1/profile/me
// @desc  get currently loged in user Profile
// @access Private
exports.getProfile = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["firstname", "lastname", "email", "avatar"]);

    if (!userProfile)
      return res.status(400).json({ errors: [{ msg: "User has no profile" }] });

    res.json({
      status: "success",
      data: userProfile,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route POST api/v1/Profile
// @desc  add or update User profile by logged in user
// @access Private
exports.addProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    instagram,
    twitter,
    LinkedIn,
  } = req.body;

  // Build Profile Object
  const ProfileFields = {};

  ProfileFields.user = req.user.id;
  if (company) ProfileFields.company = company;
  if (website) ProfileFields.website = website;
  if (bio) ProfileFields.bio = bio;
  if (status) ProfileFields.status = status;
  if (githubusername) ProfileFields.githubusername = githubusername;
  if (location) ProfileFields.location = location;
  if (skills) {
    (ProfileFields.skills = skills.split(",")).map((skill) => skill.trim());
  }

  // Build Profile Object
  ProfileFields.social = {};
  if (youtube) ProfileFields.social.youtube = youtube;
  if (twitter) ProfileFields.social.twitter = twitter;
  if (LinkedIn) ProfileFields.social.LinkedIn = LinkedIn;
  if (instagram) ProfileFields.social.instagram = instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // UPdate Profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: ProfileFields },
        { new: true }
      );
      return res.json(profile);
    }

    //   Create new Profile
    profile = new Profile(ProfileFields);
    await profile.save();
    res.json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route GET api/v1/Profile/allprofiles
// @desc  Get all profiles
// @access Public
exports.getprofiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "firstname",
      "lastname",
      "avatar",
    ]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route GET api/v1/Profile/user/:user_id
// @desc  Get user profiles by user id
// @access Public
exports.getuserprofile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["firstname", "lastname", "avatar"]);
    if (!profile)
      return res.status(400).json({ errors: [{ msg: "User has no profile" }] });

    res.json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ errors: [{ msg: "No profile found" }] });
    }
    res.status(500).send("Server error");
  }
};

// @route DELETE api/v1/Profile/user/:user_id
// @desc  delete profile, user and post by user id
// @access Private
exports.deleteuserprofile = async (req, res) => {
  try {
    // delete profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // delete user related posts
    await Post.deleteMany({ _id: req.user.id });

    // delete USer
    await User.findOneAndRemove({ _id: req.user.id });

    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ errors: [{ msg: "No profile found" }] });
    }
    res.status(500).send("Server error");
  }
};

// @route UPDATE api/v1/Profile/experience
// @desc  add user experience
// @access Private

exports.experience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route DELETE api/v1/Profile/experience/:exp_Id
// @desc  delete user experience
// @access Private
exports.deleteexprience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route UPDATE api/v1/Profile/education
// @desc  add user education
// @access Private

exports.education = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description,
  } = req.body;

  const newEduc = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEduc);
    await profile.save();
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route DELETE api/v1/Profile/education/:educ_Id
// @desc  delete user education
// @access Private
exports.deleteEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.educ_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @route GET api/v1/Profile/github/:username
// @desc  Get userrepos from github
// @access Public
exports.getgitRepos = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secrete= ${config.get("githubClientSecrete")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request.get(options, (errors, response, body) => {
      if (errors) {
        console.error(errors);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({
          status: "fial",
          msg: "No github Profile found",
        });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
