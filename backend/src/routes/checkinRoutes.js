const express = require("express");

const {
  checkin,
} = require(
  "../controllers/checkinController"
);

const router = express.Router();

router.post("/", checkin);

module.exports = router;