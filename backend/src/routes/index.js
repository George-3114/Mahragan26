const express = require("express");
const teamRoutes = require("./teamRoutes");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const individualScoreRoutes = require("./individualScoreRoutes");
const teamScoreRoutes = require("./teamScoreRoutes");
const attendanceRoutes =
require("./attendanceRoutes");
const qrSessionRoutes =
require("./qrSessionRoutes");
const checkinRoutes =
require("./checkinRoutes");
const dashboardRoutes =
require("./dashboardRoutes");
const leaderboardRoutes =
require("./leaderboardRoutes");
const announcementRoutes =
require("./announcementRoutes");
const rewardRoutes =
require("./rewardRoutes");
const materialRoutes =
require("./materialRoutes");




const router = express.Router();

router.use("/auth", authRoutes);
router.use("/teams", teamRoutes);
router.use("/users", userRoutes);
router.use("/individual-scores", individualScoreRoutes);
router.use("/team-scores", teamScoreRoutes);
router.use(
    "/attendance",
    attendanceRoutes
  );
  router.use(
    "/qr-sessions",
    qrSessionRoutes
  );
  router.use(
    "/checkin",
    checkinRoutes
  );
  router.use(
    "/dashboard",
    dashboardRoutes
  );
  router.use(
    "/leaderboard",
    leaderboardRoutes
  );
  router.use(
    "/announcements",
    announcementRoutes
  );
  router.use(
    "/rewards",
    rewardRoutes
  );
  router.use(
    "/materials",
    materialRoutes
  );
 

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

module.exports = router;