const mongoose = require("mongoose");

const sessionNoteSchema = new mongoose.Schema(
  {
    clientRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientRecord",
      required: true,
    },

    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: {
      type: String,
      required: true,
    },

    attachment: {
      fileName: {
        type: String,
      },

      filePath: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SessionNote",
  sessionNoteSchema
);