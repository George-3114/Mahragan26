const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
{
  title:{
    type:String,
    required:true,
  },

  description:{
    type:String,
    default:"",
  },

  category:{
    type:String,
    default:"General",
  },

  fileUrl:{
    type:String,
    required:true,
  },

  downloads:{
    type:Number,
    default:0,
  },

  isPublished:{
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
  "Material",
  materialSchema
);