const express = require("express");
const app = express();

app.use("/", (req, res,next) => {
  console.log("hello");
  next();
});
app.use("/2", (req, res) => {
  console.log("hello222");
  res.send("hello222");
});

app.listen(4545, () => {
  console.log("Server is successfully listening on port 4545...");
});
