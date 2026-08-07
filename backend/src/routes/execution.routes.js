const express = require("express");

const router = express.Router();

const executionController = require("../controllers/execution.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

// POST /api/executions/run/:workflowId - Run a workflow
router.post("/run/:workflowId", authenticateUser, executionController.runWorkflow);

// GET /api/executions - Get all executions
router.get("/", authenticateUser, executionController.getExecutions);

// GET /api/executions/:id - Get single execution
router.get("/:id", authenticateUser, executionController.getExecution);

module.exports = router;
