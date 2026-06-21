const User = require("../models/User");
const Team = require("../models/Team");
const Attendance = require("../models/Attendance");

const getDashboard = async (req, res) => {
  try {
    const participants =
      await User.countDocuments({
        role: "participant",
      });

    const teams =
      await Team.countDocuments();

    const attendanceRecords =
      await Attendance.countDocuments();

    const totalPointsAgg =
      await User.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalPoints",
            },
          },
        },
      ]);

    const totalPoints =
      totalPointsAgg[0]?.total || 0;

    const topParticipants =
      await User.find({
        role: "participant",
      })
        .select(
          "fullName totalPoints"
        )
        .sort({
          totalPoints: -1,
        })
        .limit(5);

    const topTeams =
      await Team.find()
        .sort({
          totalPoints: -1,
        })
        .limit(5);

    res.json({
      success: true,
      data: {
        participants,
        teams,
        attendanceRecords,
        totalPoints,
        topParticipants,
        topTeams,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};