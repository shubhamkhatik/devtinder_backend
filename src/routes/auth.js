const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT(); // schema instance method
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8hours
      httpOnly: true, // Cross-Site Scripting (XSS) attacks.(document.cookies)
    });

    res.json({ message: "User signup successfully!", data: savedUser });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});




module.exports = authRouter;
