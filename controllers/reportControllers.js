const Lead = require("../models/lead.models");

const getLeadsClosedLastWeek = async (req, res) => {
  try {
    // Current date and time
    const now = new Date();

    // Date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const leads = await Lead.find({
      status: "Closed",
      closedAt: {
        $gte: sevenDaysAgo,
        $lte: now,
      },
    }).populate("salesAgent", "name");

    const result = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      salesAgent: lead.salesAgent.name,
      closedAt: lead.closedAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET TOTAL LEADS IN PIPELINE
const getTotalLeadsInPipeline = async (req, res) => {
  try {
    const totalLeadsInPipeline = await Lead.countDocuments({
      status: { $ne: "Closed" },
    });
    res.status(200).json({ totalLeadsInPipeline: totalLeadsInPipeline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLeadsClosedLastWeek,
  getTotalLeadsInPipeline,
};
