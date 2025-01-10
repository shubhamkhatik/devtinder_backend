const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
