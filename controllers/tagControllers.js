const Tag = require("../models/tag.models");

const createTag = async (req, res) => {
  try {
    const newTag = new Tag({
      name: req.body.name,
    });

    const savedTag = await newTag.save();

    res.status(201).json({
      success: true,
      tag: savedTag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
  createTag,
  getAllTags,
};