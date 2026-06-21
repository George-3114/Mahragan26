const mongoose = require("mongoose");

const qrCheckinSchema =
new mongoose.Schema(
{
  session:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"QRSession",
    required:true,
  },

  participant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },

  checkedAt:{
    type:Date,
    default:Date.now,
  }
},
{
  timestamps:true,
}
);

module.exports =
mongoose.model(
  "QRCheckin",
  qrCheckinSchema
);