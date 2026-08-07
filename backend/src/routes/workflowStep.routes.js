const express = require("express");

const router = express.Router();

const workflowStepController = require("../controllers/workflowStep.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

// POST /api/workflows/:workflowId/steps - Add step to workflow
router.post("/:workflowId/steps", authenticateUser, workflowStepController.addWorkflowStep);

// GET /api/workflows/:workflowId/steps - Get all steps for workflow
router.get("/:workflowId/steps", authenticateUser, workflowStepController.getWorkflowSteps);

// GET /api/workflows/steps/:stepId - Get single step
router.get("/steps/:stepId", authenticateUser, workflowStepController.getWorkflowStep);

// PUT /api/workflows/steps/:stepId - Update step
router.put("/steps/:stepId", authenticateUser, workflowStepController.updateWorkflowStep);

// DELETE /api/workflows/steps/:stepId - Delete step
router.delete("/steps/:stepId", authenticateUser, workflowStepController.deleteWorkflowStep);

module.exports = router;
