const express = require("express");

const {
  createMaterial,
  getMaterials,
} = require(
  "../controllers/materialController"
);

const router =
express.Router();

router.get(
  "/",
  getMaterials
);

router.post(
  "/",
  createMaterial
);

module.exports = router;