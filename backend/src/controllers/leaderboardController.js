const User = require("../models/User");
const Team = require("../models/Team");

const getIndividualLeaderboard =
  async (req, res) => {
    try {
      const users =
        await User.find({
          role: "participant",
        })
          .select(
            "fullName totalPoints"
          )
          .sort({
            totalPoints: -1,
          });

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const getTeamLeaderboard =
  async (req, res) => {
    try {
      const teams =
        await Team.find()
          .sort({
            totalPoints: -1,
          });

      res.json({
        success: true,
        data: teams,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  getIndividualLeaderboard,
  getTeamLeaderboard,
};