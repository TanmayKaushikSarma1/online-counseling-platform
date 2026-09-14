const express = require("express");
const Razorpay = require("razorpay");

const Appointment = require("../models/Appointment");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order

router.post(
  "/create-order",
  protect,
  async (req, res) => {
    try {
      const {
        appointmentId,
      } = req.body;

      if (!appointmentId) {
        return res.status(400).json({
          message:
            "Appointment is required",
        });
      }

      const appointment =
        await Appointment.findOne({
          _id: appointmentId,
          client: req.user.id,
        });

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      if (
        appointment.paymentStatus ===
        "paid"
      ) {
        return res.status(400).json({
          message:
            "Appointment is already paid",
        });
      }

      const options = {
        amount: 50000,
        currency: "INR",

        receipt:
          "appointment_" +
          appointmentId,
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId:
          process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.log(
        "Razorpay order error:",
        error
      );

      res.status(500).json({
        message:
          "Could not create payment order",
      });
    }
  }
);

// Mark payment as successful

router.post(
  "/payment-success",
  protect,
  async (req, res) => {
    try {
      const {
        appointmentId,
      } = req.body;

      if (!appointmentId) {
        return res.status(400).json({
          message:
            "Appointment is required",
        });
      }

      const appointment =
        await Appointment.findOne({
          _id: appointmentId,
          client: req.user.id,
        });

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      appointment.paymentStatus =
        "paid";

      await appointment.save();

      res.json({
        message:
          "Payment successful",
        appointment,
      });
    } catch (error) {
      console.log(
        "Payment success error:",
        error
      );

      res.status(500).json({
        message:
          "Could not update payment",
      });
    }
  }
);

module.exports = router;