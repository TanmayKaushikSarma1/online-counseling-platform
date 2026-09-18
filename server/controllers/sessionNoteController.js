const SessionNote = require("../models/SessionNote");
const ClientRecord = require("../models/ClientRecord");

// Get session notes
const getSessionNotes = async (
  req,
  res
) => {
  try {
    const record =
      await ClientRecord.findOne({
        _id: req.params.recordId,
        counselor: req.user.id,
      });

    if (!record) {
      return res.status(404).json({
        message:
          "Client record not found",
      });
    }

    const notes =
      await SessionNote.find({
        clientRecord: record._id,
        counselor: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.json(notes);
  } catch (error) {
    console.log(
      "Get session notes error:",
      error
    );

    res.status(500).json({
      message:
        "Could not get session notes",
    });
  }
};

// Add session note with attachment
const addSessionNote = async (
  req,
  res
) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        message:
          "Please enter a session note",
      });
    }

    const record =
      await ClientRecord.findOne({
        _id: req.params.recordId,
        counselor: req.user.id,
      });

    if (!record) {
      return res.status(404).json({
        message:
          "Client record not found",
      });
    }

    const sessionNote =
      new SessionNote({
        clientRecord: record._id,
        counselor: req.user.id,
        note: note.trim(),
      });

    if (req.file) {
      sessionNote.attachment = {
        fileName:
          req.file.originalname,
        filePath:
          `/uploads/${req.file.filename}`,
      };
    }

    await sessionNote.save();

    res.status(201).json({
      message: "Session note added",
      sessionNote,
    });
  } catch (error) {
    console.log(
      "Add session note error:",
      error
    );

    res.status(500).json({
      message:
        "Could not add session note",
    });
  }
};

module.exports = {
  getSessionNotes,
  addSessionNote,
};