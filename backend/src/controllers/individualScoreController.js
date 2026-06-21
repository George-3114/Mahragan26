const {
    createScore,
  } = require("../services/individualScoreService");
  
  const createIndividualScore = async (req, res) => {
    try {
      const score = await createScore({
        participantId: req.body.participantId,
        category: req.body.category,
        points: req.body.points,
        description: req.body.description,
        adminId: req.user._id,
      });
  
      res.status(201).json({
        success: true,
        data: score,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  const getIndividualScores = async (req, res) => {
    try {
      const scores = await require("../models/IndividualScore")
        .find()
        .populate("participant", "fullName")
        .populate("awardedBy", "fullName")
        .sort({ createdAt: -1 });
  
      res.json({
        success: true,
        data: scores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  module.exports = {
    createIndividualScore,
    getIndividualScores,
  };