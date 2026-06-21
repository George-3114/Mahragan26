const express = require("express");

const {
  getIndividualLeaderboard,
  getTeamLeaderboard,
} = require(
  "../controllers/leaderboardController"
);

const router =
  express.Router();

router.get(
  "/individual",
  getIndividualLeaderboard
);

router.get(
  "/teams",
  getTeamLeaderboard
);

module.exports = router;