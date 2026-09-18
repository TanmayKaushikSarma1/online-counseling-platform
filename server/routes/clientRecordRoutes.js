const express = require("express");

const {
  protect,
  counselorOnly,
} = require("../middleware/authMiddleware");

const {
  getClientRecords,
  getClientRecord,
  createClientRecord,
} = require("../controllers/clientRecordController");

const router = express.Router();

// Get counselor's clients
router.get(
  "/",
  protect,
  counselorOnly,
  getClientRecords
);

// Get one client record
router.get(
  "/:id",
  protect,
  counselorOnly,
  getClientRecord
);

// Create a client record
router.post(
  "/create",
  protect,
  counselorOnly,
  createClientRecord
);

module.exports = router;