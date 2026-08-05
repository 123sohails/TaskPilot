const express = require("express");
const cors = require("cors");
const workflowRoutes = require("./routes/workflow.routes");
const metricsRoutes = require("./routes/metrics.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskPilot Backend is running 🚀"
  });
});

// Workflow routes
app.use("/api/workflows", workflowRoutes);

// Prometheus metrics endpoint
app.use("/metrics", metricsRoutes);

module.exports = app;