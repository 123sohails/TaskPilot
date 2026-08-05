const workflowStepService = require("../services/workflowStep.service");

// Temporary user ID (replace with real Auth user later)
const TEMP_USER_ID = "PASTE_REAL_SUPABASE_AUTH_USER_UUID_HERE";

/**
 * Add a step to a workflow
 */
async function addWorkflowStep(req, res) {
  try {
    const { workflowId } = req.params;
    const step = await workflowStepService.addWorkflowStep(
      workflowId,
      req.body
    );

    res.status(201).json(step);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Get all steps for a workflow
 */
async function getWorkflowSteps(req, res) {
  try {
    const { workflowId } = req.params;
    const steps = await workflowStepService.getWorkflowSteps(workflowId);

    res.json(steps);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Get a single step by ID
 */
async function getWorkflowStep(req, res) {
  try {
    const step = await workflowStepService.getWorkflowStepById(req.params.stepId);

    res.json(step);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Update a workflow step
 */
async function updateWorkflowStep(req, res) {
  try {
    const step = await workflowStepService.updateWorkflowStep(
      req.params.stepId,
      req.body
    );

    res.json(step);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Delete a workflow step
 */
async function deleteWorkflowStep(req, res) {
  try {
    const result = await workflowStepService.deleteWorkflowStep(req.params.stepId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  addWorkflowStep,
  getWorkflowSteps,
  getWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep,
};
