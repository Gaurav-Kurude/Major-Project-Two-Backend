const SalesAgent = require("../models/salesAgent.models");

const createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if email already exists
    const existingAgent = await SalesAgent.findOne({ email });

    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Sales Agent with this email already exists",
      });
    }

    // Create agent
    const agent = await SalesAgent.create({
      name,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Sales Agent created successfully",
      data: agent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllSalesAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find();

    res.status(200).json({
      success: true,
      agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales agents",
      error: error.message,
    });
  }
};

module.exports = {
  createAgent,
  getAllSalesAgents,
};