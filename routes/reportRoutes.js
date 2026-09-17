const express = require("express");

const router = express.Router();

const {
  getLeadsClosedLastWeek,
  getTotalLeadsInPipeline,
} = require("../controllers/reportControllers");

router.get("/last-week", getLeadsClosedLastWeek);

router.get("/pipeline", getTotalLeadsInPipeline);

module.exports = router;