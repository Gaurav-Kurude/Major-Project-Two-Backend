const mongoose = require("mongoose");
const Comment = require("../models/comment.models");

const createComment = async (req, res) => {
  try {
    const { lead, author, commentText } = req.body;

    if (!lead || !author || !commentText) {
      return res.status(400).json({
        success: false,
        message: "Lead, author and commentText are required",
      });
    }

    const newComment = await Comment.create({
      lead,
      author,
      commentText,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL COMMENTS FOR A LEAD
const getCommentsForLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if Lead ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: `Invalid Lead ID '${id}'.`,
      });
    }

    // Find comments for this lead
    const comments = await Comment.find({ lead: id })
      .populate("author", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(
      comments.map((comment) => ({
        id: comment._id,
        commentText: comment.commentText,
        author: comment.author.name,
        createdAt: comment.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


module.exports = {
  createComment,
  getCommentsForLead,
};