const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true,
  },

  description:{
    type:String,
    default:"",
  },

  quantity:{
    type:Number,
    required:true,
  },

  stock:{
    type:Number,
    default:0,
  },

  image:{
    type:String,
    default:"",
  },

  isActive:{
    type:Boolean,
    default:true,
  },
},
{
  timestamps:true,
}
);

module.exports =
mongoose.model(
  "Reward",
  rewardSchema
);