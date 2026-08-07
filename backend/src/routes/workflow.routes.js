const express = require("express");
const router = express.Router();

const workflowController = require("../controllers/workflow.controller");

router.post("/create", workflowController.createWorkflow);
router.get("/", workflowController.getWorkflows);
router.get("/:id", workflowController.getWorkflow);
router.put("/:id", workflowController.updateWorkflow);
router.delete("/:id", workflowController.deleteWorkflow);

module.exports = router;