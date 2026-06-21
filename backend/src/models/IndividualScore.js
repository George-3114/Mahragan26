const mongoose = require("mongoose");

const individualScoreSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "LITURGY",
        "CONFESSION",
        "PARTICIPATION",
        "PSALM",
        "GOOGLE_FORM",
        "LEADER_OF_WEEK",
        "BONUS",
        "PENALTY",
      ],
      required: true,
    },

    points: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    awardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "IndividualScore",
  individualScoreSchema
);