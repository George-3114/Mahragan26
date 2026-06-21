const mongoose = require("mongoose");

const teamScoreSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "QUIZ",
        "MONTHLY_LITURGY",
        "FLAG",
        "PRESENTATION",
        "ABKARA",
        "ATTENDANCE",
        "SPIRIT",
        "DISCIPLINE",
        "SPORTS",
        "PSALM",
        "HYMN",
        "TEAM_OF_TWO_WEEKS",
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
  "TeamScore",
  teamScoreSchema
);