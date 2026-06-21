const mongoose = require("mongoose");

const announcementSchema =
new mongoose.Schema(
{
  title:{
    type:String,
    required:true,
  },

  content:{
    type:String,
    required:true,
  },

  priority:{
    type:String,
    enum:[
      "normal",
      "high",
      "urgent",
    ],
    default:"normal",
  },

  isPublished:{
    type:Boolean,
    default:true,
  },

  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
},
{
  timestamps:true,
}
);

module.exports =
mongoose.model(
  "Announcement",
  announcementSchema
);