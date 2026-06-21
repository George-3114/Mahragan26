const {
    createTeamScore,
  } = require("../services/teamScoreService");
  
  const TeamScore =
  require("../models/TeamScore");
  
  const createScore =
  async(req,res)=>{
    try{
  
      const score =
        await createTeamScore({
          teamId:req.body.teamId,
          category:req.body.category,
          points:req.body.points,
          description:req.body.description,
          adminId:req.user._id,
        });
  
      res.status(201).json({
        success:true,
        data:score,
      });
  
    }catch(error){
      res.status(500).json({
        success:false,
        message:error.message,
      });
    }
  };
  
  const getScores =
  async(req,res)=>{
    try{
  
      const scores =
        await TeamScore.find()
        .populate("team")
        .sort({
          createdAt:-1
        });
  
      res.json({
        success:true,
        data:scores,
      });
  
    }catch(error){
      res.status(500).json({
        success:false,
        message:error.message,
      });
    }
  };
  
  module.exports = {
    createScore,
    getScores,
  };