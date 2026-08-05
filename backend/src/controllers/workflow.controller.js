const { workflowQueue, deadLetterQueue } = require("../queues/task.queue");
const idempotencyService = require("../services/idempotency.service");

/**
 * Trigger a workflow execution
 */
async function triggerWorkflow(req, res) {
  try {
    const { workflowId, triggerEvent, idempotencyKey, steps } = req.body;

    // Validate required fields
    if (!workflowId || !steps || !Array.isArray(steps)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: workflowId and steps array",
      });
    }

    // Generate idempotency key if not provided
    const finalIdempotencyKey = idempotencyKey || 
      idempotencyService.constructor.generateKey({ workflowId, triggerEvent, steps });

    // Check if already processed
    const alreadyProcessed = await idempotencyService.isProcessed(finalIdempotencyKey);
    if (alreadyProcessed) {
      const metadata = await idempotencyService.getMetadata(finalIdempotencyKey);
      return res.status(200).json({
        success: true,
        status: "skipped",
        reason: "duplicate_event",
        idempotencyKey: finalIdempotencyKey,
        previousExecution: metadata,
      });
    }

    // Add job to queue
    const job = await workflowQueue.add(
      "execute-workflow",
      {
        workflowId,
        triggerEvent,
        idempotencyKey: finalIdempotencyKey,
        steps,
      },
      {
        jobId: finalIdempotencyKey, // Use idempotency key as job ID for deduplication
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    res.status(202).json({
      success: true,
      message: "Workflow triggered successfully",
      jobId: job.id,
      idempotencyKey: finalIdempotencyKey,
    });
  } catch (error) {
    console.error("Error triggering workflow:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get workflow execution status by job ID
 */
async function getExecutionStatus(req, res) {
  try {
    const { jobId } = req.params;

    const job = await workflowQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    const state = await job.getState();
    const logs = await job.getLogs();

    res.json({
      success: true,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        state,
        progress: job.progress,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        logs,
      },
    });
  } catch (error) {
    console.error("Error getting execution status:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get dead-letter queue jobs
 */
async function getDeadLetterJobs(req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const jobs = await deadLetterQueue.getJobs(
      ["failed", "waiting"],
      parseInt(offset),
      parseInt(offset) + parseInt(limit) - 1
    );

    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => ({
        id: job.id,
        name: job.name,
        data: job.data,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      }))
    );

    res.json({
      success: true,
      jobs: jobsWithDetails,
      total: await deadLetterQueue.getJobCountByTypes("failed"),
    });
  } catch (error) {
    console.error("Error getting dead-letter jobs:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Retry a dead-letter job
 */
async function retryDeadLetterJob(req, res) {
  try {
    const { jobId } = req.params;

    // Get the job from dead-letter queue
    const deadLetterJobs = await deadLetterQueue.getJobs();
    const jobToRetry = deadLetterJobs.find((job) => job.id === jobId);

    if (!jobToRetry) {
      return res.status(404).json({
        success: false,
        error: "Dead-letter job not found",
      });
    }

    // Remove from dead-letter queue
    await jobToRetry.remove();

    // Re-add to main workflow queue
    const newJob = await workflowQueue.add(
      "execute-workflow",
      jobToRetry.data,
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    res.json({
      success: true,
      message: "Job requeued for execution",
      newJobId: newJob.id,
    });
  } catch (error) {
    console.error("Error retrying dead-letter job:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get queue statistics
 */
async function getQueueStats(req, res) {
  try {
    const workflowCounts = await workflowQueue.getJobCounts();
    const deadLetterCounts = await deadLetterQueue.getJobCounts();

    res.json({
      success: true,
      workflowQueue: workflowCounts,
      deadLetterQueue: deadLetterCounts,
    });
  } catch (error) {
    console.error("Error getting queue stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  triggerWorkflow,
  getExecutionStatus,
  getDeadLetterJobs,
  retryDeadLetterJob,
  getQueueStats,
};
