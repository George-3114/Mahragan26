const express = require("express");

const {
  createIndividualScore,
  getIndividualScores,
} = require("../controllers/individualScoreController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getIndividualScores
);

router.post(
  "/",
  protect,
  adminOnly,
  createIndividualScore
);

module.exports = router;