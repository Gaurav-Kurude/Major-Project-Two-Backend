const express = require("express");

const router = express.Router();

const {
  createComment,
  getCommentsForLead,
} = require("../controllers/commentControllers");

router.post("/addcomment", createComment);

router.get("/lead/:id", getCommentsForLead);

module.exports = router;
