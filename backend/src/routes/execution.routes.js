const express = require("express");

const router = express.Router();

const executionController = require("../controllers/execution.controller");

// POST /api/executions/run/:workflowId - Run a workflow
router.post("/run/:workflowId", executionController.runWorkflow);

// GET /api/executions - Get all executions
router.get("/", executionController.getExecutions);

// GET /api/executions/:id - Get single execution
router.get("/:id", executionController.getExecution);

module.exports = router;
