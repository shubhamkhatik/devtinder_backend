const express = require("express");
const { Chat } = require("../models/chat.model");
const { userAuth } = require("../middleware/userAuth");
const chatRouter = express.Router();

// GET /chat/:targetUserId?page=1&limit=10
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    // Paginate messages (latest first)
    const totalMessages = chat.messages.length;
    const start = Math.max(totalMessages - page * limit, 0);
    const end = totalMessages - (page - 1) * limit;
    const paginatedMessages = chat.messages.slice(start, end);

    // Populate sender info for paginated messages
    // senderId should be ObjectId ref to User
    // We'll use mongoose's populate method on a lean document
    // But since we sliced the array, we need to manually populate
    // We'll use User model for this
    const User = require("../models/user.model");
    const populatedMessages = await Promise.all(
      paginatedMessages.map(async (msg) => {
        let sender = null;
        if (msg.senderId) {
          sender = await User.findById(msg.senderId).select(
            "firstName lastName"
          );
        }
        return {
          ...(msg.toObject ? msg.toObject() : msg),
          senderId: sender
            ? {
                _id: sender._id,
                firstName: sender.firstName,
                lastName: sender.lastName,
              }
            : msg.senderId,
        };
      })
    );

    res.json({
      ...chat.toObject(),
      messages: populatedMessages,
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = chatRouter;
