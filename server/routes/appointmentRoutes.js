const express = require("express");
const Appointment = require("../models/Appointment");
const ClientRecord = require("../models/ClientRecord");
const User = require("../models/User");
const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Book an appointment
router.post("/", protect, async (req, res) => {
  try {
    const {
      counselor,
      service,
      date,
      time,
    } = req.body;

    if (!counselor || !service || !date || !time) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const counselorUser = await User.findOne({
      _id: counselor,
      role: "counselor",
    });

    if (!counselorUser) {
      return res.status(404).json({
        message: "Counselor not found",
      });
    }

    // Check if the time is already booked
    const existingAppointment =
      await Appointment.findOne({
        counselor,
        date,
        time,
        status: "booked",
      });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked",
      });
    }

    // Create appointment
    const appointment = new Appointment({
      client: req.user.id,
      counselor,
      service,
      date,
      time,
    });

    await appointment.save();

    // Create client record if it doesn't already exist
    const existingRecord =
      await ClientRecord.findOne({
        client: req.user.id,
        counselor,
      });

    if (!existingRecord) {
      const clientRecord = new ClientRecord({
        client: req.user.id,
        counselor,
      });

      await clientRecord.save();
    }

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.log("Appointment error:", error);

    res.status(500).json({
      message: "Could not book appointment",
      error: error.message,
    });
  }
});

// Get client's appointments
router.get("/client", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      client: req.user.id,
    })
      .populate(
        "counselor",
        "name specialization"
      )
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Could not get appointments",
    });
  }
});

// Get counselor's appointments
router.get(
  "/counselor",
  protect,
  async (req, res) => {
    try {
      const appointments = await Appointment.find({
        counselor: req.user.id,
      })
        .populate(
          "client",
          "name email phone"
        )
        .sort({ date: 1, time: 1 });

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        message: "Could not get appointments",
      });
    }
  }
);

// Cancel appointment
router.put(
  "/:id/cancel",
  protect,
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          message: "Appointment not found",
        });
      }

      if (
        appointment.client.toString() !==
          req.user.id &&
        appointment.counselor.toString() !==
          req.user.id
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to cancel this appointment",
        });
      }

      appointment.status = "cancelled";

      await appointment.save();

      res.json({
        message: "Appointment cancelled",
      });
    } catch (error) {
      res.status(500).json({
        message: "Could not cancel appointment",
      });
    }
  }
);

module.exports = router;