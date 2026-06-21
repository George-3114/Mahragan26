const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionType: {
      type: String,
      enum: [
        "liturgy",
        "meeting",
        "activity",
        "competition",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "present",
        "absent",
        "excused",
      ],
      default: "present",
    },

    notes: {
      type: String,
      default: "",
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Attendance",
    attendanceSchema
  );