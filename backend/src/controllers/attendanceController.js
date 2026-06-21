const Attendance =
  require("../models/Attendance");

const createAttendance =
  async (req, res) => {
    try {
      const attendance =
        await Attendance.create(
          req.body
        );

      res.status(201).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const getAttendances =
  async (req, res) => {
    try {
      const records =
        await Attendance.find()
          .populate("participant")
          .populate("recordedBy");

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  createAttendance,
  getAttendances,
};