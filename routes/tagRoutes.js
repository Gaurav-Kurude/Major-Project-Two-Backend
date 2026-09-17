const express = require("express");

const router = express.Router();

const { getAllTags } = require("../controllers/tagControllers");

router.post("/", createTag);
router.get("/", getAllTags);

module.exports = router;