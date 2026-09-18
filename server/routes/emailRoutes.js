const express = require("express");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  sendEmail,
} = require("../controllers/emailController");

const router = express.Router();

// Send email
router.post(
  "/send",
  protect,
  sendEmail
);

module.exports = router;