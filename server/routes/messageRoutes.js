const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get user information for chat
router.get("/user/:userId", protect, async (req, res) => {
  try {
    const user = await User.findById(
      req.params.userId
    ).select("name email role");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.log(
      "Get chat user error:",
      error
    );

    res.status(500).json({
      message: "Could not get user",
    });
  }
});

// Get messages between two users
router.get("/:userId", protect, async (req, res) => {
  try {
    const otherUser = await User.findById(
      req.params.userId
    );

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
          receiver: req.params.userId,
        },
        {
          sender: req.params.userId,
          receiver: req.user.id,
        },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.log(
      "Get messages error:",
      error
    );

    res.status(500).json({
      message: "Could not get messages",
    });
  }
});

// Send a message
router.post("/", protect, async (req, res) => {
  try {
    const { receiver, message } = req.body;

    if (
      !receiver ||
      !message ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Please enter a message",
      });
    }

    const receiverUser = await User.findById(
      receiver
    );

    if (!receiverUser) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const newMessage = new Message({
      sender: req.user.id,
      receiver,
      message: message.trim(),
    });

    await newMessage.save();

    const populatedMessage =
      await Message.findById(
        newMessage._id
      )
        .populate("sender", "name role")
        .populate("receiver", "name role");

    res.status(201).json(
      populatedMessage
    );
  } catch (error) {
    console.log(
      "Send message error:",
      error
    );

    res.status(500).json({
      message: "Could not send message",
    });
  }
});

module.exports = router;