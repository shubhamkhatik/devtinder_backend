const { Server } = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat.model");
const ConnectionRequest = require("../models/connection.model");
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://devtinder-frontend-pearl.vercel.app",
        "https://devtinder-frontend-git-main-shubhamkhatiks-projects.vercel.app",
        "https://devtinder-frontend-shubhamkhatiks-projects.vercel.app",
      ],
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const room = getSecretRoomId(userId, targetUserId);
      socket.join(room);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          // TODO: Check if userId & targetUserId are friends
          const areUsersFriends = async (userId, targetUserId) => {
            const connection = await ConnectionRequest.findOne({
              $or: [
                {
                  fromUserId: userId,
                  toUserId: targetUserId,
                  status: "accepted",
                },
                {
                  fromUserId: targetUserId,
                  toUserId: userId,
                  status: "accepted",
                },
              ],
            });
            return !!connection;
          };
          const isFriend = await areUsersFriends(userId, targetUserId);
          if (!isFriend) {
            // If not friends, send a warning to the sender
            socket.emit("notFriendsWarning", {
              message: "You can only message users you are connected with.",
              targetUserId,
            });
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            updatedAt: chat.messages[chat.messages.length - 1].updatedAt,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = initializeSocket;
