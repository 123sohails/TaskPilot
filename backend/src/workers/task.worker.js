const { Worker } = require("bullmq");
const { redisConnection, deadLetterQueue } = require("../queues/task.queue");
const idempotencyService = require("../services/idempotency.service");

const workflowWorker = new Worker(
  "workflows",
  async (job) => {
    const { workflowId, triggerEvent, idempotencyKey, steps } = job.data;
    
    job.log(`Starting workflow execution: ${workflowId}`);
    const startTime = Date.now();
    
    // Check idempotency - only skip if this is NOT a retry
    if (idempotencyKey && job.attemptsMade === 0 && await idempotencyService.isProcessed(idempotencyKey)) {
      job.log(`Duplicate event detected: ${idempotencyKey}`);
      return { status: "skipped", reason: "duplicate_event" };
    }
    
    // Execute steps
    const results = [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      job.log(`Executing step ${i + 1}/${steps.length}: ${step.type}`);
      
      try {
        const result = await executeStep(step, job);
        results.push({
          stepIndex: i,
          type: step.type,
          status: "success",
          result,
        });
        job.log(`Step ${i + 1} completed successfully`);
      } catch (error) {
        job.log(`Step ${i + 1} failed: ${error.message}`);
        results.push({
          stepIndex: i,
          type: step.type,
          status: "failed",
          error: error.message,
        });
        throw new Error(`Step ${i + 1} (${step.type}) failed: ${error.message}`);
      }
    }
    
    // Mark as processed only after successful completion
    if (idempotencyKey) {
      await idempotencyService.markProcessed(idempotencyKey, { workflowId, jobId: job.id });
    }
    
    const duration = Date.now() - startTime;
    job.log(`Workflow completed in ${duration}ms`);
    
    return {
      status: "completed",
      duration,
      steps: results,
      attemptsMade: job.attemptsMade,
    };
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

// Handle failed jobs - move to DLQ
workflowWorker.on("failed", async (job, error) => {
  console.error(`Job ${job.id} failed: ${error.message}`);
  console.error(`Attempts made: ${job.attemptsMade}, Max attempts: ${job.opts.attempts}`);
  
  if (job.attemptsMade >= (job.opts.attempts || 3)) {
    console.log(`Moving job ${job.id} to dead-letter queue after ${job.attemptsMade} attempts`);
    
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
  switch (step.type) {
    case "delay":
      return await executeDelay(step.config, job);
    case "http_request":
      return await executeHttpRequest(step.config, job);
    default:
      throw new Error(`Unknown step type: ${step.type}`);
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

module.exports = workflowWorker;