require("dotenv").config();

const { Worker } = require("bullmq");
const { redisConnection, deadLetterQueue } = require("../queues/task.queue");
const idempotencyService = require("../services/idempotency.service");
const executionService = require("../services/execution.service");

// Import integrations
const aiService = require("../services/ai.service");
const githubService = require("../integrations/github/github.service");
const gmailService = require("../integrations/gmail/gmail.service");
const notionService = require("../integrations/notion/notion.service");

const workflowWorkerProcessor = async (job) => {
    console.log(`Worker received job: ${job.id} for workflow: ${job.data.workflowId}`);
    const { workflowId, triggerEvent, idempotencyKey, steps, executionId } = job.data;
    
    job.log(`Starting workflow execution: ${workflowId}`);
    const startTime = Date.now();

    try {

      if (executionId) {
        await executionService.updateExecution(executionId, "running", {
          message: "Workflow execution started",
          triggerEvent,
          attempt: job.attemptsMade + 1,
        });
      }
    } catch (error) {
      console.warn(`Unable to update execution ${executionId} to running:`, error.message);
    }
    
    // Check idempotency - only skip if this is NOT a retry
    if (idempotencyKey && job.attemptsMade === 0 && await idempotencyService.isProcessed(idempotencyKey)) {
      job.log(`Duplicate event detected: ${idempotencyKey}`);

      try {
        if (executionId) {
          await executionService.updateExecution(executionId, "skipped", {
            message: "Duplicate event detected",
            reason: "duplicate_event",
          });
        }
      } catch (error) {
        console.warn(`Unable to update execution ${executionId} to skipped:`, error.message);
      }

      return { status: "skipped", reason: "duplicate_event" };
    }
    
    // Execute steps
    const results = [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepType = step.step_type || step.type;
      job.log(`Executing step ${i + 1}/${steps.length}: ${stepType}`);
      
      try {
        const result = await executeStep(step, job);
        results.push({
          stepIndex: i,
          type: stepType,
          status: "success",
          result,
        });
        job.log(`Step ${i + 1} completed successfully`);
      } catch (error) {
        job.log(`Step ${i + 1} failed: ${error.message}`);
        results.push({
          stepIndex: i,
          type: stepType,
          status: "failed",
          error: error.message,
        });
        throw new Error(`Step ${i + 1} (${stepType}) failed: ${error.message}`);
      }
    }
    
    // Mark as processed only after successful completion
    if (idempotencyKey) {
      await idempotencyService.markProcessed(idempotencyKey, { workflowId, jobId: job.id });
    }
    
    const duration = Date.now() - startTime;
    job.log(`Workflow completed in ${duration}ms`);

    try {
      if (executionId) {
        await executionService.updateExecution(executionId, "completed", {
          message: "Workflow execution completed",
          duration,
          attemptsMade: job.attemptsMade,
          steps: results,
        });
      }
    } catch (error) {
      console.warn(`Unable to update execution ${executionId} to completed:`, error.message);
    }
    
    return {
      status: "completed",
      duration,
      steps: results,
      attemptsMade: job.attemptsMade,
    };
  };

const workflowWorker = process.env.NODE_ENV === 'test' 
  ? { on: () => {} }
  : new Worker("workflows", workflowWorkerProcessor, {
    connection: redisConnection,
    concurrency: 5,
  });

if (process.env.NODE_ENV !== 'test') {
  console.log("Workflow worker initialized, waiting for jobs...");
  workflowWorker.on("ready", () => {
    console.log("Worker is ready and connected to Redis");
  });
  workflowWorker.on("error", (error) => {
    console.error("Worker error:", error);
  });
  workflowWorker.on("active", (job) => {
    console.log(`Worker picked up job: ${job.id}`);
  });
  workflowWorker.on("completed", (job) => {
    console.log(`Worker completed job: ${job.id}`);
  });
}


// Handle failed jobs - move to DLQ
workflowWorker.on("failed", async (job, error) => {
  console.error(`Job ${job.id} failed: ${error.message}`);
  console.error(`Attempts made: ${job.attemptsMade}, Max attempts: ${job.opts.attempts}`);
  
  if (job.attemptsMade >= (job.opts.attempts || 3)) {
    console.log(`Moving job ${job.id} to dead-letter queue after ${job.attemptsMade} attempts`);
    
    try {
      if (job.data.executionId) {
        await executionService.updateExecution(job.data.executionId, "failed", {
          message: "Workflow execution failed after retries",
          error: error.message,
          attemptsMade: job.attemptsMade,
        });
      }
    } catch (updateError) {
      console.warn(`Unable to update execution ${job.data.executionId} to failed:`, updateError.message);
    }

    try {
      await deadLetterQueue.add("failed-workflow", {
        originalJobId: job.id,
        workflowId: job.data.workflowId,
        triggerEvent: job.data.triggerEvent,
        idempotencyKey: job.data.idempotencyKey,
        steps: job.data.steps,
        error: error.message,
        failedAt: new Date().toISOString(),
        attemptsMade: job.attemptsMade,
        stack: error.stack,
      });
      console.log(`Successfully moved job ${job.id} to DLQ`);
    } catch (dlqError) {
      console.error(`Failed to move job to DLQ:`, dlqError);
    }
  }
});

workflowWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

async function executeStep(step, job) {
  const stepType = step.step_type || step.type;
  switch (stepType) {
    case "delay":
      return await executeDelay(step.config, job);
    case "http_request":
      return await executeHttpRequest(step.config, job);
    case "ai_summarize":
      job.log(`Running AI Summarize on provided text`);
      return { summary: await aiService.analyzeText(step.config?.text || "", "general") };
    case "github_create_issue":
      job.log(`Creating GitHub Issue in ${step.config?.owner}/${step.config?.repo}`);
      return await githubService.createIssue(step.config, {});
    case "gmail_send":
      job.log(`Sending Email to ${step.config?.to}`);
      return await gmailService.sendEmail(step.config, {});
    case "notion_create_page":
      job.log(`Creating Notion Page in DB ${step.config?.databaseId}`);
      return await notionService.createPage(step.config, {});
    default:
      throw new Error(`Unknown step type: ${stepType}`);
  }
}

async function executeDelay(config, job) {
  const delayMs = config?.duration || 1000;
  job.log(`Delaying for ${delayMs}ms`);
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return { delayed: true, duration: delayMs };
}

async function executeHttpRequest(config, job) {
  const axios = require("axios");
  const response = await axios({
    method: config?.method || "POST",
    url: config?.url,
    headers: config?.headers || {},
    data: config?.body,
    timeout: config?.timeout || 30000,
  });
  return response.data;
}

module.exports = { workflowWorker, workflowWorkerProcessor };