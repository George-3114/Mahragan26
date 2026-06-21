const express = require("express");

const {
  createScore,
  getScores,
} = require(
  "../controllers/teamScoreController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const router =
express.Router();

router.get(
  "/",
  getScores
);

router.post(
  "/",
  protect,
  adminOnly,
  createScore
);

module.exports = router;