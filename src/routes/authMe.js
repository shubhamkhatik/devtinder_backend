const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const express = require("express");
const authMeRouter = express.Router();
authMeRouter.get("/auth/me", async(req, res) => {
    try {
        const { token } = req.cookies; 
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { _id } = decoded;
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ data:user });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Invalid token" });
    }
  });
  module.exports = authMeRouter;
  