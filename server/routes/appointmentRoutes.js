const express = require("express");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  bookAppointment,
  getClientAppointments,
  getCounselorAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

// Book appointment
router.post(
  "/",
  protect,
  bookAppointment
);

// Client appointments
router.get(
  "/client",
  protect,
  getClientAppointments
);

// Counselor appointments
router.get(
  "/counselor",
  protect,
  getCounselorAppointments
);

// Cancel appointment
router.put(
  "/:id/cancel",
  protect,
  cancelAppointment
);

module.exports = router;