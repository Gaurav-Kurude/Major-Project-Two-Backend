const express = require("express");

const router = express.Router();

const { createTag,getAllTags } = require("../controllers/tagControllers");

router.post("/", createTag);
router.get("/", getAllTags);

module.exports = router;