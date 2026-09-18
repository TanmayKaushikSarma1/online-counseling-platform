const Razorpay = require("razorpay");
const Appointment = require("../models/Appointment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        message: "Appointment ID is required",
      });
    }

    const appointment =
      await Appointment.findOne({
        _id: appointmentId,
        client: req.user.id,
      });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const options = {
      amount: 50000,
      currency: "INR",
      receipt: `appointment_${appointmentId}`,
    };

    const order =
      await razorpay.orders.create(options);

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.log(
      "Create order error:",
      error
    );

    res.status(500).json({
      message: "Could not create payment order",
    });
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        message: "Appointment ID is required",
      });
    }

    const appointment =
      await Appointment.findOne({
        _id: appointmentId,
        client: req.user.id,
      });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.paymentStatus = "paid";

    await appointment.save();

    res.json({
      message: "Payment successful",
      appointment,
    });
  } catch (error) {
    console.log(
      "Payment success error:",
      error
    );

    res.status(500).json({
      message: "Could not update payment status",
    });
  }
};

module.exports = {
  createOrder,
  paymentSuccess,
};