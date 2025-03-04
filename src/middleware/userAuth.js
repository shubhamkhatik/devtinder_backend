const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ ERROR: "Please Login!" });
    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    // jwt handle errors, if error its goes to catch

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ ERROR: "user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json("Invalid Token");
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json("Token Expired");
    }
    res.status(400).json("ERROR: " + error.message);
  }
};

module.exports = {
  userAuth,
};
