const express = require("express");
const User = require("../models/User");
const {
  protect,
  counselorOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all counselors
router.get("/", async (req, res) => {
  try {
    const counselors = await User.find({
      role: "counselor",
    }).select("-password");

    res.json(counselors);
  } catch (error) {
    res.status(500).json({
      message: "Could not get counselors",
    });
  }
});

// Update counselor profile
router.put(
  "/profile",
  protect,
  counselorOnly,
  async (req, res) => {
    try {
      const counselor = await User.findById(req.user.id);

      if (!counselor) {
        return res.status(404).json({
          message: "Counselor not found",
        });
      }

      counselor.specialization =
        req.body.specialization || "";

      counselor.experience =
        req.body.experience || 0;

      counselor.bio =
        req.body.bio || "";

      counselor.services =
        req.body.services || [];

      counselor.availability =
        req.body.availability || [];

      await counselor.save();

      res.status(200).json({
        message: "Profile updated successfully",
        counselor: {
          id: counselor._id,
          name: counselor.name,
          email: counselor.email,
          role: counselor.role,
          specialization: counselor.specialization,
          experience: counselor.experience,
          bio: counselor.bio,
          services: counselor.services,
          availability: counselor.availability,
        },
      });
    } catch (error) {
      console.log("Profile update error:", error);

      res.status(500).json({
        message: "Could not update profile",
        error: error.message,
      });
    }
  }
);

// Get one counselor
router.get("/:id", async (req, res) => {
  try {
    const counselor = await User.findOne({
      _id: req.params.id,
      role: "counselor",
    }).select("-password");

    if (!counselor) {
      return res.status(404).json({
        message: "Counselor not found",
      });
    }

    res.json(counselor);
  } catch (error) {
    res.status(500).json({
      message: "Could not get counselor",
    });
  }
});

module.exports = router;