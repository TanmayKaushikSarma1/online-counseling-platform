const Appointment = require("../models/Appointment");
const ClientRecord = require("../models/ClientRecord");
const User = require("../models/User");

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const {
      counselor,
      service,
      date,
      time,
    } = req.body;

    if (
      !counselor ||
      !service ||
      !date ||
      !time
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const counselorUser =
      await User.findOne({
        _id: counselor,
        role: "counselor",
      });

    if (!counselorUser) {
      return res.status(404).json({
        message: "Counselor not found",
      });
    }

    const existingAppointment =
      await Appointment.findOne({
        counselor,
        date,
        time,
        status: "booked",
      });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "This time slot is already booked",
      });
    }

    const appointment =
      new Appointment({
        client: req.user.id,
        counselor,
        service,
        date,
        time,
      });

    await appointment.save();

    // Create a client record if one does not already exist
    const existingRecord =
      await ClientRecord.findOne({
        client: req.user.id,
        counselor,
      });

    if (!existingRecord) {
      const clientRecord =
        new ClientRecord({
          client: req.user.id,
          counselor,
        });

      await clientRecord.save();
    }

    res.status(201).json({
      message:
        "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.log(
      "Book appointment error:",
      error
    );

    res.status(500).json({
      message:
        "Could not book appointment",
    });
  }
};

// Get client's appointments
const getClientAppointments = async (
  req,
  res
) => {
  try {
    const appointments =
      await Appointment.find({
        client: req.user.id,
      })
        .populate(
          "counselor",
          "name specialization"
        )
        .sort({
          date: 1,
          time: 1,
        });

    res.json(appointments);
  } catch (error) {
    console.log(
      "Get client appointments error:",
      error
    );

    res.status(500).json({
      message:
        "Could not get appointments",
    });
  }
};

// Get counselor's appointments
const getCounselorAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          counselor: req.user.id,
        })
          .populate(
            "client",
            "name email phone"
          )
          .sort({
            date: 1,
            time: 1,
          });

      res.json(appointments);
    } catch (error) {
      console.log(
        "Get counselor appointments error:",
        error
      );

      res.status(500).json({
        message:
          "Could not get appointments",
      });
    }
  };

// Cancel appointment
const cancelAppointment = async (
  req,
  res
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Only the client or counselor can cancel
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
    console.log(
      "Cancel appointment error:",
      error
    );

    res.status(500).json({
      message:
        "Could not cancel appointment",
    });
  }
};

module.exports = {
  bookAppointment,
  getClientAppointments,
  getCounselorAppointments,
  cancelAppointment,
};