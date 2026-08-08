const crypto = require("crypto");
const executionService = require("../services/execution.service");
const supabase = require("../config/supabase");
const aiService = require("../services/ai.service");

/**
 * Verify GitHub webhook signature
 */
function verifyGitHubSignature(payload, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Handle GitHub webhook with AI integration
 */
async function handleGitHubWebhook(req, res) {
  try {
    const signature = req.headers["x-hub-signature-256"];
    const githubEvent = req.headers["x-github-event"];
    const deliveryId = req.headers["x-github-delivery"];

    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    
    // Temporarily skip signature verification for testing
    // TODO: Enable this in production
    /*
    if (!signature) {
      return res.status(401).json({ error: "No signature provided" });
    }
    
    if (!webhookSecret) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    // Verify signature
    const payload = JSON.stringify(req.body);
    if (!verifyGitHubSignature(payload, signature, webhookSecret)) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    */

    console.log(`GitHub webhook received: ${githubEvent} (${deliveryId})`);

    // Get all active workflows for AI to analyze
    const { data: allWorkflows, error: workflowsError } = await supabase
      .from("workflows")
      .select("*")
      .eq("status", "active");

    if (workflowsError) {
      console.error("Failed to fetch workflows:", workflowsError.message);
      return res.status(500).json({ error: "Failed to process webhook" });
    }

    // AI analyzes the GitHub event
    let aiAnalysis = null;
    let suggestedWorkflowId = null;
    
    try {
      console.log("AI analyzing GitHub event...");
      aiAnalysis = await aiService.analyzeGitHubEvent(req.body);
      console.log("AI Analysis:", aiAnalysis);
      
      // AI suggests the best workflow
      if (allWorkflows && allWorkflows.length > 0) {
        suggestedWorkflowId = await aiService.suggestGitHubWorkflow(aiAnalysis, allWorkflows);
        console.log("AI Suggested Workflow:", suggestedWorkflowId);
      }
    } catch (aiError) {
      console.warn("AI analysis failed, falling back to manual matching:", aiError.message);
    }

    // Use AI suggestion if available, otherwise fall back to manual matching
    let workflowsToTrigger = [];
    
    if (suggestedWorkflowId) {
      const suggestedWorkflow = allWorkflows.find(w => w.id === suggestedWorkflowId);
      if (suggestedWorkflow) {
        workflowsToTrigger = [suggestedWorkflow];
        console.log(`Using AI-suggested workflow: ${suggestedWorkflow.name}`);
      }
    }
    
    // Fallback to manual trigger type matching
    if (workflowsToTrigger.length === 0) {
      workflowsToTrigger = allWorkflows.filter(w => w.trigger_type === `github_${githubEvent}`);
      console.log(`Fallback: Found ${workflowsToTrigger.length} workflows with manual trigger matching`);
    }

    if (workflowsToTrigger.length === 0) {
      console.log(`No workflows triggered for event: ${githubEvent}`);
      return res.status(200).json({ 
        message: "No matching workflows",
        aiAnalysis: aiAnalysis || "AI analysis failed"
      });
    }

    // Trigger each workflow with AI-enriched data
    const results = [];
    for (const workflow of workflowsToTrigger) {
      try {
        const triggerData = {
          source: "github_webhook",
          event: githubEvent,
          deliveryId,
          payload: req.body,
          aiAnalysis: aiAnalysis || null,
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
          aiSuggested: workflow.id === suggestedWorkflowId,
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
      aiAnalysis: aiAnalysis || "AI analysis disabled",
      results,
    });
  } catch (error) {
    console.error("GitHub webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}

/**
 * Handle Gmail webhook with AI integration (via Pub/Sub push)
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

    // Get all active workflows for AI to analyze
    const { data: allWorkflows, error: workflowsError } = await supabase
      .from("workflows")
      .select("*")
      .eq("status", "active");

    if (workflowsError) {
      console.error("Failed to fetch workflows:", workflowsError.message);
      return res.status(500).json({ error: "Failed to process webhook" });
    }

    // AI analyzes the email
    let aiClassification = null;
    let actionItems = null;
    let suggestedWorkflowId = null;
    
    try {
      console.log("AI classifying email...");
      aiClassification = await aiService.classifyGmailEmail(emailData);
      console.log("AI Classification:", aiClassification);
      
      // AI extracts action items
      console.log("AI extracting action items...");
      actionItems = await aiService.extractActionItems(emailData);
      console.log("AI Action Items:", actionItems);
      
      // AI suggests the best workflow
      if (allWorkflows && allWorkflows.length > 0) {
        suggestedWorkflowId = await aiService.suggestEmailWorkflow(aiClassification, actionItems, allWorkflows);
        console.log("AI Suggested Workflow:", suggestedWorkflowId);
      }
    } catch (aiError) {
      console.warn("AI analysis failed, falling back to manual matching:", aiError.message);
    }

    // Use AI suggestion if available, otherwise fall back to manual matching
    let workflowsToTrigger = [];
    
    if (suggestedWorkflowId) {
      const suggestedWorkflow = allWorkflows.find(w => w.id === suggestedWorkflowId);
      if (suggestedWorkflow) {
        workflowsToTrigger = [suggestedWorkflow];
        console.log(`Using AI-suggested workflow: ${suggestedWorkflow.name}`);
      }
    }
    
    // Fallback to manual trigger type matching
    if (workflowsToTrigger.length === 0) {
      workflowsToTrigger = allWorkflows.filter(w => w.trigger_type === "gmail_received");
      console.log(`Fallback: Found ${workflowsToTrigger.length} workflows with manual trigger matching`);
    }

    if (workflowsToTrigger.length === 0) {
      console.log("No workflows triggered for email_received event");
      return res.status(200).json({ 
        message: "No matching workflows",
        aiClassification: aiClassification || "AI classification failed"
      });
    }

    // Trigger each workflow with AI-enriched data
    const results = [];
    for (const workflow of workflowsToTrigger) {
      try {
        const triggerData = {
          source: "gmail_webhook",
          event: "email_received",
          payload: emailData,
          aiClassification: aiClassification || null,
          actionItems: actionItems || null,
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
          aiSuggested: workflow.id === suggestedWorkflowId,
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
      event: "email_received",
      workflowsTriggered: results.length,
      aiClassification: aiClassification || "AI classification disabled",
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
