const express = require('express');
const router = express.Router();
const workflowcontroller = require("../controllers/workflow.controller");
router.post('/create', workflowcontroller.createWorkflow);
router.get("/", workflowcontroller.getWorkflows);
router.get("/:id", workflowController.getWorkflow);
router.put("/:id", workflowController.updateWorkflow);
router.delete("/:id", workflowController.deleteWorkflow);
module.exports = router;
