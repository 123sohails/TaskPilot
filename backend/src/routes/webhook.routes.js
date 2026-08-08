const express = require("express");
const router = express.Router();

const webhookController = require("../controllers/webhook.controller");

// GitHub webhook endpoint (no authentication - verified by signature)
router.post("/github", webhookController.handleGitHubWebhook);

// Gmail webhook endpoint (via Pub/Sub push)
router.post("/gmail", webhookController.handleGmailWebhook);

module.exports = router;
