const express = require("express");
const app = express();
const connectDB = require("./config/database");
const PORT=process.env.PORT || 5452;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const authMeRouter = require("./routes/authMe");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const http = require("http");
const initializeSocket = require("./utils/socket");


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://devtinder-frontend-pearl.vercel.app', 'https://devtinder-frontend-git-main-shubhamkhatiks-projects.vercel.app', 'https://devtinder-frontend-shubhamkhatiks-projects.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use("/", authRouter);
app.use("/", profileRouter);
app.use('/',requestRouter)
app.use('/',authMeRouter);
app.use('/',userRouter);
app.use('/',chatRouter);
const httpServer  = http.createServer(app);
initializeSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log("Server is successfully listening on port..."+PORT);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
