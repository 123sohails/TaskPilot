const express = require("express");

const router = express.Router();

const workflowStepController = require("../controllers/workflowStep.controller");

// POST /api/workflows/:workflowId/steps - Add step to workflow
router.post("/:workflowId/steps", workflowStepController.addWorkflowStep);

// GET /api/workflows/:workflowId/steps - Get all steps for workflow
router.get("/:workflowId/steps", workflowStepController.getWorkflowSteps);

// GET /api/workflows/steps/:stepId - Get single step
router.get("/steps/:stepId", workflowStepController.getWorkflowStep);

// PUT /api/workflows/steps/:stepId - Update step
router.put("/steps/:stepId", workflowStepController.updateWorkflowStep);

// DELETE /api/workflows/steps/:stepId - Delete step
router.delete("/steps/:stepId", workflowStepController.deleteWorkflowStep);

module.exports = router;
