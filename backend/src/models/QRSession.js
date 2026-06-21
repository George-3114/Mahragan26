const mongoose = require("mongoose");

const qrSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
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

    code: {
      type: String,
      required: true,
      unique: true,
    },

    qrImage: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 60,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
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
    "QRSession",
    qrSessionSchema
  );