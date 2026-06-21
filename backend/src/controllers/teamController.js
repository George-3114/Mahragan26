const Team = require("../models/Team");

const createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .sort({ totalPoints: -1 });

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
  createTeam,
  getTeams,
};