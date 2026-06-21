const express = require("express");

const {
  getRewards,
  createReward,
} = require(
  "../controllers/rewardController"
);

const router =
express.Router();

router.get(
  "/",
  getRewards
);

router.post(
  "/",
  createReward
);

module.exports = router;