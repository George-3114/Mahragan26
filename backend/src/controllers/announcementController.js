const Announcement =
require("../models/Announcement");

const createAnnouncement =
async (req,res)=>{
  try{

    const announcement =
      await Announcement.create({
        ...req.body,
      });

    res.status(201).json({
      success:true,
      data:announcement,
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

const getAnnouncements =
async(req,res)=>{
  try{

    const announcements =
      await Announcement.find()
      .sort({
        createdAt:-1
      });

    res.json({
      success:true,
      data:announcements,
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
};