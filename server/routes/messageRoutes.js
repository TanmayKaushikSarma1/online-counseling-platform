const express = require("express");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  getChatUser,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

const router = express.Router();

// Get user information for chat
router.get(
  "/user/:userId",
  protect,
  getChatUser
);

// Get messages between two users
router.get(
  "/:userId",
  protect,
  getMessages
);

// Send a message
router.post(
  "/",
  protect,
  sendMessage
);

module.exports = router;