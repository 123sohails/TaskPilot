const express = require("express");
const cors = require("cors");

const workflowRoutes = require("./routes/workflow.routes");
const workflowStepRoutes = require("./routes/workflowStep.routes");
const executionRoutes = require("./routes/execution.routes");
const metricsRoutes = require("./routes/metrics.routes");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskPilot Backend is running 🚀",
  });
});

app.use("/api/workflows", workflowRoutes);
app.use("/api/workflows", workflowStepRoutes);
app.use("/api/executions", executionRoutes);
app.use("/metrics", metricsRoutes);
app.use("/api/metrics", metricsRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;