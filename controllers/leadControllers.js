const mongoose = require("mongoose");
const Lead = require("../models/lead.models");

const createLead = async (req, res) => {
  try {
    const { name, source, salesAgent, status, priority, tags, timeToClose } =
      req.body;

    if (!name || !source || !salesAgent || !timeToClose) {
      return res.status(400).json({
        success: false,
        message: "Name, source, salesAgent and timeToClose are required.",
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

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead: newLead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("salesAgent");

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

    // 1. Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Lead ID '${id}'.`,
      });
    }

    // 2. Check required fields
    if (!name || !source || !salesAgent || !timeToClose || !priority) {
      return res.status(400).json({
        success: false,
        message:
          "Name, source, salesAgent, timeToClose and priority are required.",
      });
    }

    // 3. Create update data
    const updateData = {
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
      updatedAt: Date.now(),
    };

    // 4. Closing date
    if (status === "Closed") {
      updateData.closedAt = new Date();
    } else {
      updateData.closedAt = undefined;
    }

    // 5. Update lead
    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("salesAgent", "name email");

    // 6. Lead not found
    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: `Lead with ID '${id}' not found.`,
      });
    }

    // 7. Success response
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

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: `Invalid Lead ID '${id}'.`,
      });
    }

    const deletedLead = await Lead.findByIdAndDelete(id);

    // Lead not found
    if (!deletedLead) {
      return res.status(404).json({
        error: `Lead with ID '${id}' not found.`,
      });
    }

    res.status(200).json({
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET LEAD BY ID
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Lead ID '${id}'.`,
      });
    }

    // Find lead and populate sales agent
    const lead = await Lead.findById(req.params.id).populate("salesAgent");

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
      lead: lead,
    });
  } catch (error) {
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
