const User = require("../models/User");
const {
  generateToken,
  comparePassword,
} = require("../services/authService");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await comparePassword(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          role: user.role,
          team: user.team,
          totalPoints: user.totalPoints,
          attendancePercentage:
            user.attendancePercentage,
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
  login,
};