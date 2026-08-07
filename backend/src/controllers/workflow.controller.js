const workflowService = require("../services/workflow.service");

/**
 * Create a new workflow
 */
async function createWorkflow(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const workflow = await workflowService.createWorkflow(userId, req.body);

    res.status(201).json(workflow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Get all workflows for the authenticated user
 */
async function getWorkflows(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const workflows = await workflowService.getWorkflows(userId);

    res.json(workflows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Get a single workflow by ID
 */
async function getWorkflow(req, res) {
  try {
    const workflow = await workflowService.getWorkflowById(req.params.id);

    res.json(workflow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Update a workflow
 */
async function updateWorkflow(req, res) {
  try {
    const workflow = await workflowService.updateWorkflow(
      req.params.id,
      req.body
    );

    res.json(workflow);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * Delete a workflow
 */
async function deleteWorkflow(req, res) {
  try {
    const result = await workflowService.deleteWorkflow(req.params.id);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createWorkflow,
  getWorkflows,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
};
