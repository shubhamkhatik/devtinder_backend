const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered!" });
    }
    // Encrypt the password
    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    );

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    savedUser.password = undefined;
    // another way to senitize the password of  "Mongoose document object",
    // const userToSend = savedUser.toObject();
    // delete userToSend.password;

    const token = await savedUser.getJWT(); // schema instance method
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Prevent CSRF
    });

    res.json({ message: "User signup successfully!", data: savedUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({
      message: "An error occurred during signup. Please try again later.",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId }).select("+password");
    // due to select:false password not added to user object,so validatePassword method failed

    if (!user) {
      throw new Error("User not found!");
    }
    const isPasswordValid = await user.validatePassword(password); // schema instance method

    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }
    user.password = undefined; //clean up the added password
    const token = await user.getJWT(); // schema instance method
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true,  
      sameSite: "None",  
    }); 
    res.json({ message: "User login successfully!", data: user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      message: "An error occurred during login. Please try again later.",
      
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "User logout successfully!" });
});

module.exports = authRouter;
