const express = require("express");
const app = express();
const connectDB = require("./config/database");
const PORT=process.env.PORT;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");


app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log("Server is successfully listening on port..."+PORT);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
