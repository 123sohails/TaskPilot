const express = require("express");
const router = express.Router();

const workflowController = require("../controllers/workflow.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

// All workflow routes require authentication
router.use(authenticateUser);

router.post("/", workflowController.createWorkflow);
router.get("/", workflowController.getWorkflows);
router.get("/:id", workflowController.getWorkflow);
router.put("/:id", workflowController.updateWorkflow);
router.delete("/:id", workflowController.deleteWorkflow);

module.exports = router;