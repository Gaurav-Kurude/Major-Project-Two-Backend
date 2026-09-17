const express = require("express");

const router = express.Router();

const { getAllTags } = require("../controllers/tagControllers");

router.get("/", getAllTags);

module.exports = router;