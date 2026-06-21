const Reward =
require("../models/Reward");

const getRewards =
async(req,res)=>{
  try{

    const rewards =
      await Reward.find({
        isActive:true,
      });

    res.json({
      success:true,
      data:rewards,
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

const createReward =
async(req,res)=>{
  try{

    const reward =
      await Reward.create(
        req.body
      );

    res.status(201).json({
      success:true,
      data:reward,
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

module.exports = {
  getRewards,
  createReward,
};