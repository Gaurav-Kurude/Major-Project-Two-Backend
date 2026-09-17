const express = require("express");
const router = express.Router();

const { createAgent, getAllSalesAgents } = require("../controllers/salesAgentControllers");

router.post("/", createAgent);
router.get("/", getAllSalesAgents);

module.exports = router;
