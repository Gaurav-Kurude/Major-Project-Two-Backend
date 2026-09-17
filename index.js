require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");

// const Comment = require("./models/comment.models");
// const Lead = require("./models/lead.models");
// const salesAgent = require("./models/salesAgent.models");
// const tag = require("./models/tag.models");
const leadRoutes = require("./routes/leadRoutes");
const salesAgentRoutes = require("./routes/salesAgentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const tagRoutes = require("./routes/tagRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/sales-agents", salesAgentRoutes);
app.use("/", commentRoutes);
app.use("/leads", leadRoutes);
app.use("/tags", tagRoutes);
app.use("/report", reportRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// Port
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (error) {
    console.log(
      "Server could not start because MongoDB connection failed."
    );
  }
}

startServer();