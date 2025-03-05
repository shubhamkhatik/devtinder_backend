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
const userRouter = require("./routes/user");


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://devtinder-frontend-pearl.vercel.app','https://devtinder-frontend-git-main-shubhamkhatiks-projects.vercel.app','https://devtinder-frontend-shubhamkhatiks-projects.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use('/api',requestRouter)
app.use('/api',authMeRouter);
app.use('/api',userRouter);
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
