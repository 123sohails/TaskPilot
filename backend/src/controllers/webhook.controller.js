const crypto = require("crypto");
const executionService = require("../services/execution.service");
const supabase = require("../config/supabase");

/**
 * Verify GitHub webhook signature
 */
function verifyGitHubSignature(payload, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Handle GitHub webhook
 */
async function handleGitHubWebhook(req, res) {
  try {
    const signature = req.headers["x-hub-signature-256"];
    const githubEvent = req.headers["x-github-event"];
    const deliveryId = req.headers["x-github-delivery"];

    if (!signature) {
      return res.status(401).json({ error: "No signature provided" });
    }

    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    // Verify signature
    const payload = JSON.stringify(req.body);
    if (!verifyGitHubSignature(payload, signature, webhookSecret)) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    console.log(`GitHub webhook received: ${githubEvent} (${deliveryId})`);

    // Find workflows with GitHub trigger matching this event
    const { data: workflows, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("trigger_type", `github_${githubEvent}`)
      .eq("status", "active");

    if (error) {
      console.error("Failed to fetch workflows:", error.message);
      return res.status(500).json({ error: "Failed to process webhook" });
    }

    if (!workflows || workflows.length === 0) {
      console.log(`No active workflows found for event: ${githubEvent}`);
      return res.status(200).json({ message: "No matching workflows" });
    }

    // Trigger each matching workflow
    const results = [];
    for (const workflow of workflows) {
      try {
        const triggerData = {
          source: "github_webhook",
          event: githubEvent,
          deliveryId,
          payload: req.body,
        };

        const execution = await executionService.runWorkflow(
          workflow.id,
          workflow.user_id,
          triggerData
        );

        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          executionId: execution.execution.id,
          status: "triggered",
        });

        console.log(`Triggered workflow ${workflow.name} (${workflow.id})`);
      } catch (error) {
        console.error(`Failed to trigger workflow ${workflow.id}:`, error.message);
        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          status: "failed",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Webhook processed",
      event: githubEvent,
      workflowsTriggered: results.length,
      results,
    });
  } catch (error) {
    console.error("GitHub webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}

/**
 * Handle Gmail webhook (via Pub/Sub push)
 */
async function handleGmailWebhook(req, res) {
  try {
    const message = req.body.message;
    
    if (!message) {
      return res.status(400).json({ error: "No message in Pub/Sub payload" });
    }

    // Decode Pub/Sub message
    const data = Buffer.from(message.data, 'base64').toString('utf-8');
    const emailData = JSON.parse(data);

    console.log(`Gmail webhook received: ${emailData.emailAddress}`);

    // Find workflows with Gmail trigger
    const { data: workflows, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("trigger_type", "gmail_received")
      .eq("status", "active");

    if (error) {
      console.error("Failed to fetch workflows:", error.message);
      return res.status(500).json({ error: "Failed to process webhook" });
    }

    if (!workflows || workflows.length === 0) {
      console.log("No active workflows found for gmail_received event");
      return res.status(200).json({ message: "No matching workflows" });
    }

    // Trigger each matching workflow
    const results = [];
    for (const workflow of workflows) {
      try {
        const triggerData = {
          source: "gmail_webhook",
          event: "email_received",
          payload: emailData,
        };

        const execution = await executionService.runWorkflow(
          workflow.id,
          workflow.user_id,
          triggerData
        );

        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          executionId: execution.execution.id,
          status: "triggered",
        });

        console.log(`Triggered workflow ${workflow.name} (${workflow.id})`);
      } catch (error) {
        console.error(`Failed to trigger workflow ${workflow.id}:`, error.message);
        results.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          status: "failed",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Webhook processed",
      workflowsTriggered: results.length,
      results,
    });
  } catch (error) {
    console.error("Gmail webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}

module.exports = {
  handleGitHubWebhook,
  handleGmailWebhook,
};
