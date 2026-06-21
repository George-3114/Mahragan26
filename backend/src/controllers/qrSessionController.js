const QRSession =
require("../models/QRSession");

const QRCode =
require("qrcode");

const createSession =
async (req,res) => {
  try {

    const {
      title,
      sessionType,
      duration = 60
    } = req.body;

    const code =
      "QR-" +
      Math.random()
      .toString(36)
      .substring(2,8)
      .toUpperCase();

    const expiresAt =
      new Date(
        Date.now() +
        duration * 60000
      );

    const qrImage =
      await QRCode.toDataURL(code);

    const session =
      await QRSession.create({
        title,
        sessionType,
        duration,
        code,
        qrImage,
        expiresAt,
      });

    res.status(201).json({
      success:true,
      data:session,
    });

  } catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

const getSessions =
async(req,res)=>{
  try{

    const sessions =
      await QRSession.find()
      .sort({createdAt:-1});

    res.json({
      success:true,
      data:sessions,
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

module.exports = {
  createSession,
  getSessions,
};