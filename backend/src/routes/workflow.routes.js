const express = require("express");
const router = express.Router();
const {
  triggerWorkflow,
  getExecutionStatus,
  getDeadLetterJobs,
  retryDeadLetterJob,
  getQueueStats,
} = require("../controllers/workflow.controller");

// Trigger a workflow execution
router.post("/trigger", triggerWorkflow);

// Get execution status by job ID
router.get("/status/:jobId", getExecutionStatus);

// Get dead-letter queue jobs
router.get("/dead-letter", getDeadLetterJobs);

// Retry a dead-letter job
router.post("/dead-letter/:jobId/retry", retryDeadLetterJob);

// Get queue statistics
router.get("/stats", getQueueStats);

module.exports = router;
