const express = require("express");

const {
  protect,
  counselorOnly,
} = require("../middleware/authMiddleware");

const {
  getCounselors,
  updateCounselorProfile,
  getCounselor,
} = require("../controllers/counselorController");

const router = express.Router();

// Get all counselors
router.get(
  "/",
  getCounselors
);

// Update counselor profile
router.put(
  "/profile",
  protect,
  counselorOnly,
  updateCounselorProfile
);

// Get one counselor
router.get(
  "/:id",
  getCounselor
);

module.exports = router;