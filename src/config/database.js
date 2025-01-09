const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("database",process.env.DB_CONNECTION_SECRET);
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connectDB;