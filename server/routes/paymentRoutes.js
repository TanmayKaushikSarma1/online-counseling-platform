const express = require("express");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  createOrder,
  paymentSuccess,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Razorpay order
router.post(
  "/create-order",
  protect,
  createOrder
);

// Confirm successful payment
router.post(
  "/payment-success",
  protect,
  paymentSuccess
);

module.exports = router;