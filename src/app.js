const express = require("express");
const app = express();
const connectDB = require("./config/database");
const PORT=process.env.PORT;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const authMeRouter = require("./routes/authMe");


app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,              
}
app.use(cors(corsOptions))

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use('/api',requestRouter)
app.use('/api',authMeRouter);
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
