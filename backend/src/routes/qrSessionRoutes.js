const express = require("express");

const {
  createSession,
  getSessions,
} = require(
  "../controllers/qrSessionController"
);

const router =
  express.Router();

router.get(
  "/",
  getSessions
);

router.post(
  "/",
  createSession
);

module.exports = router;