const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
const validator = require("validator");
const User = require("../models/user.model");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!validateEditProfileData(req)) {
      return res.status(400).send("Invalid Edit Request");
    }

    // Check if the email field is being updated
    if (emailId) {
      if (!validator.isEmail(emailId)) {
        return res.status(400).send("Invalid email address");
      }

      // Check if the email is already taken by another user
      const emailExists = await User.findOne({ emailId });
      if (
        emailExists &&
        emailExists._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).send("Email is already in use");
      }
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      if (key in loggedInUser) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    // Handle duplicate key error (race conditions)
    if (err.code === 11000 && err.keyPattern) {
      return res.status(400).send("Email is already exist");
    }

    res.status(500).json({
      error: "Profile update failed",
      message: err.message,
    });
  }
});

module.exports = profileRouter;
