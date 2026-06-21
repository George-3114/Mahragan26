const QRSession = require("../models/QRSession");
const QRCheckin = require("../models/QRCheckin");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const IndividualScore = require("../models/IndividualScore");

const checkin = async (req, res) => {
  try {
    const { participantId, code } = req.body;

    const session = await QRSession.findOne({
      code,
      isActive: true,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Invalid QR code",
      });
    }

    if (session.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session expired",
      });
    }

    const existingCheckin =
      await QRCheckin.findOne({
        session: session._id,
        participant: participantId,
      });

    if (existingCheckin) {
      return res.status(400).json({
        success: false,
        message: "Already checked in",
      });
    }

    await QRCheckin.create({
      session: session._id,
      participant: participantId,
    });

    await Attendance.create({
      participant: participantId,
      sessionType: session.sessionType,
      status: "present",
    });

    // Liturgy = +100
    if (session.sessionType === "liturgy") {
        const admin = await User.findOne({
            role: "admin",
          });
          await IndividualScore.create({
            participant: participantId,
            category: "LITURGY",
            points: 100,
            description: `QR Attendance - ${session.title}`,
            awardedBy: admin._id,
          });

      await User.findByIdAndUpdate(
        participantId,
        {
          $inc: {
            totalPoints: 100,
          },
        }
      );
    }

    res.json({
      success: true,
      message: "Check-in successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  checkin,
};