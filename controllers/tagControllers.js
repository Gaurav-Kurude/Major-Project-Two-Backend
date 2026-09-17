const Tag = require("../models/tag.models");

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllTags,
};