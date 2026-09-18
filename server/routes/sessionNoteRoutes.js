const express = require("express");
const multer = require("multer");

const {
  protect,
  counselorOnly,
} = require("../middleware/authMiddleware");

const {
  getSessionNotes,
  addSessionNote,
} = require("../controllers/sessionNoteController");

const router = express.Router();

// File storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const fileName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, fileName);
  },
});

const upload = multer({
  storage,
});

// Get session notes
router.get(
  "/:recordId",
  protect,
  counselorOnly,
  getSessionNotes
);

// Add session note with attachment
router.post(
  "/:recordId",
  protect,
  counselorOnly,
  upload.single("attachment"),
  addSessionNote
);

module.exports = router;