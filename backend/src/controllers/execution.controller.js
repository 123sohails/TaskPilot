const executionService = require("../services/execution.service");

// Temporary user ID (replace with real Auth user later)
const TEMP_USER_ID = "PASTE_REAL_SUPABASE_AUTH_USER_UUID_HERE";

/**
 * Run a workflow execution
 */
async function runWorkflow(req, res) {
  try {
    const { workflowId } = req.params;
    const triggerData = req.body.triggerData || {};

    const execution = await executionService.runWorkflow(
      workflowId,
      TEMP_USER_ID,
      triggerData
    );

    res.status(201).json(execution);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Get all executions for the current user
 */
async function getExecutions(req, res) {
  try {
    const executions = await executionService.getExecutions(TEMP_USER_ID);

    res.json(executions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Get a single execution by ID
 */
async function getExecution(req, res) {
  try {
    const execution = await executionService.getExecutionById(req.params.id);

    res.json(execution);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  runWorkflow,
  getExecutions,
  getExecution,
};
