const express = require("express");
const router = express.Router();

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadControllers");

const {
  getCommentsForLead,
} = require("../controllers/commentControllers");

router.post("/", createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.get("/:id/comments", getCommentsForLead);

module.exports = router;
