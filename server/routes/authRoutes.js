const express = require("express");

const {
  protect,
  counselorOnly,
} = require("../middleware/authMiddleware");

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.get(
  "/counselor-test",
  protect,
  counselorOnly,
  (req, res) => {
    res.json({
      message:
        "Welcome Counselor",
    });
  }
);

module.exports = router;