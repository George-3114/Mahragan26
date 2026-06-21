const express = require("express");

const {
  createAttendance,
  getAttendances,
} = require(
  "../controllers/attendanceController"
);

const router =
  express.Router();

router.get(
  "/",
  getAttendances
);

router.post(
  "/",
  createAttendance
);

module.exports = router;