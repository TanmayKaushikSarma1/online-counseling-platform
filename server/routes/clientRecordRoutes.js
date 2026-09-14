const express = require("express");
const ClientRecord = require("../models/ClientRecord");
const Appointment = require("../models/Appointment");
const {
  protect,
  counselorOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get counselor's clients
router.get(
  "/",
  protect,
  counselorOnly,
  async (req, res) => {
    try {
      // Find appointments for this counselor
      const appointments = await Appointment.find({
        counselor: req.user.id,
      });

      // Create missing client records
      for (const appointment of appointments) {
        const existingRecord =
          await ClientRecord.findOne({
            client: appointment.client,
            counselor: req.user.id,
          });

        if (!existingRecord) {
          const clientRecord = new ClientRecord({
            client: appointment.client,
            counselor: req.user.id,
          });

          await clientRecord.save();
        }
      }

      const records = await ClientRecord.find({
        counselor: req.user.id,
      })
        .populate(
          "client",
          "name email phone"
        )
        .sort({ updatedAt: -1 });

      res.json(records);
    } catch (error) {
      console.log("Get client records error:", error);

      res.status(500).json({
        message: "Could not get client records",
      });
    }
  }
);

// Get one client record
router.get(
  "/:id",
  protect,
  counselorOnly,
  async (req, res) => {
    try {
      const record = await ClientRecord.findOne({
        _id: req.params.id,
        counselor: req.user.id,
      }).populate(
        "client",
        "name email phone"
      );

      if (!record) {
        return res.status(404).json({
          message: "Client record not found",
        });
      }

      const appointments =
        await Appointment.find({
          client: record.client._id,
          counselor: req.user.id,
        }).sort({
          date: 1,
          time: 1,
        });

      res.json({
        record,
        appointments,
      });
    } catch (error) {
      console.log("Client record error:", error);

      res.status(500).json({
        message: "Could not get client record",
      });
    }
  }
);

// Create a client record from an appointment
router.post(
  "/create",
  protect,
  counselorOnly,
  async (req, res) => {
    try {
      const { client } = req.body;

      if (!client) {
        return res.status(400).json({
          message: "Client is required",
        });
      }

      const existingRecord =
        await ClientRecord.findOne({
          client,
          counselor: req.user.id,
        });

      if (existingRecord) {
        return res.json(existingRecord);
      }

      const record = new ClientRecord({
        client,
        counselor: req.user.id,
      });

      await record.save();

      const populatedRecord =
        await ClientRecord.findById(
          record._id
        ).populate(
          "client",
          "name email phone"
        );

      res.status(201).json(populatedRecord);
    } catch (error) {
      res.status(500).json({
        message: "Could not create client record",
      });
    }
  }
);

module.exports = router;