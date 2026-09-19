const mongoose = require("mongoose");

// Lead Schema
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lead name is required"],
  },

  source: {
    type: String,
    required: [true, "Lead source is required"],
    enum: [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ],
  },

  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesAgent",
    required: true,
  },

  status: {
    type: String,
    required: true,
    enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
    default: "New",
  },

  tags: {
    type: [String],
  },

  timeToClose: {
    type: Number,
    required: [true, "Time to Close is required"],
    min: [1, "Time to Close must be a positive number"],
  },

  priority: {
    type: String,
    required: true,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  closedAt: {
    type: Date,
  },
});

// Update dates before saving
leadSchema.pre("save", function () {
  this.updatedAt = Date.now();

  // Set closedAt when lead is closed
  if (this.status === "Closed" && !this.closedAt) {
    this.closedAt = Date.now();
  }

  // Clear closedAt if lead is reopened
  if (this.status !== "Closed") {
    this.closedAt = undefined;
  }
});

module.exports = mongoose.model("Lead", leadSchema);
