const mongoose = require("mongoose");
const Lead = require("../models/lead.models");
const Tag = require("../models/tag.models");

// CREATE LEAD
const createLead = async (req, res) => {
  try {
    const { name, source, salesAgent, status, priority, tags, timeToClose } =
      req.body;

    if (!name || !source || !salesAgent || !timeToClose || !priority) {
      return res.status(400).json({
        success: false,
        message:
          "Name, source, salesAgent, timeToClose and priority are required.",
      });
    }

    const newLead = await Lead.create({
      name,
      source,
      salesAgent,
      status,
      priority,
      tags,
      timeToClose,
    });

    const populatedLead = await Lead.findById(newLead._id).populate(
      "salesAgent",
      "name email",
    );

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead: populatedLead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL LEADS
const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("salesAgent", "name email");

    res.status(200).json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

// UPDATE LEAD
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Lead ID '${id}'.`,
      });
    }

    if (!name || !source || !salesAgent || !timeToClose || !priority) {
      return res.status(400).json({
        success: false,
        message:
          "Name, source, salesAgent, timeToClose and priority are required.",
      });
    }

    // Make sure tags is always an array
    const updatedTags = Array.isArray(tags) ? tags : [];

    // Update lead
    const updateData = {
      name,
      source,
      salesAgent,
      status,
      tags: updatedTags,
      timeToClose,
      priority,
      updatedAt: Date.now(),
    };

    if (status === "Closed") {
      updateData.closedAt = new Date();
    } else {
      updateData.closedAt = undefined;
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("salesAgent", "name email");

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID '${id}' not found.`,
      });
    }

    // Create new tags in Tag collection
    for (const tagName of updatedTags) {
      await Tag.findOneAndUpdate(
        { name: tagName },
        { name: tagName },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE LEAD
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if Lead ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Lead ID '${id}'.`,
      });
    }

    const deletedLead = await Lead.findByIdAndDelete(id);

    // Lead not found
    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID '${id}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET LEAD BY ID
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if Lead ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Lead ID '${id}'.`,
      });
    }

    // Find lead and populate sales agent
    const lead = await Lead.findById(id).populate("salesAgent", "name email");

    // Lead not found
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID '${id}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead fetched successfully",
      lead,
    });
  } catch (error) {
    console.error("Get lead by ID error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};
