const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
    {
      name: String,
    
      color: {
        type: String,
        default: "#3B82F6",
      },
    
      logoUrl: {
        type: String,
        default: "",
      },
    
      flagUrl: {
        type: String,
        default: "",
      },
    
      motto: {
        type: String,
        default: "",
      },
    
      description: {
        type: String,
        default: "",
      },
    
      memberCount: {
        type: Number,
        default: 0,
      },
    
      totalPoints: {
        type: Number,
        default: 0,
      },
    
      categoryPoints: {
        liturgy: { type: Number, default: 0 },
        hymns: { type: Number, default: 0 },
        sports: { type: Number, default: 0 },
        quizzes: { type: Number, default: 0 },
        attendance: { type: Number, default: 0 },
      },
    
      festivalYear: {
        type: String,
        default: "2026",
      },
    
      status: {
        type: String,
        default: "active",
      },
    
      rank: {
        type: Number,
        default: 0,
      },
    
      memberCount: {
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

module.exports = mongoose.model("Team", teamSchema);