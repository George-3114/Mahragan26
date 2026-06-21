const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "participant"],
      default: "participant",
    },

    grade: {
      type: String,
      default: "",
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    totalPoints: {
      type: Number,
      default: 0,
    },

    attendancePercentage: {
      type: Number,
      default: 0,
    },

    badges: [
        {
          type: String,
        },
      ],


      grade: {
        type: String,
        enum: [
          "Grade5",
          "Grade6"
        ],
      },
      
      redeemedRewards: {
        type: Number,
        default: 0,
      },


    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);