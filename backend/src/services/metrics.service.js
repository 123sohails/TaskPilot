const { workflowQueue, deadLetterQueue } = require("../queues/task.queue");

// Simple in-memory metrics store (for production, use prom-client)
const metrics = {
  workflowExecutions: {
    total: 0,
    completed: 0,
    failed: 0,
    skipped: 0,
  },
  deadLetterJobs: 0,
  queueSizes: {
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
  },
};

/**
 * Increment workflow execution counter
 */
function incrementWorkflowExecution(status) {
  metrics.workflowExecutions.total++;
  if (status === "completed") {
    metrics.workflowExecutions.completed++;
  } else if (status === "failed") {
    metrics.workflowExecutions.failed++;
  } else if (status === "skipped") {
    metrics.workflowExecutions.skipped++;
  }
}

/**
 * Update dead letter job count
 */
async function updateDeadLetterCount() {
  const counts = await deadLetterQueue.getJobCountByTypes("failed");
  metrics.deadLetterJobs = counts;
}

/**
 * Update queue size metrics
 */
async function updateQueueMetrics() {
  const workflowCounts = await workflowQueue.getJobCounts();
  metrics.queueSizes = workflowCounts;
}

/**
 * Get Prometheus-formatted metrics
 */
async function getPrometheusMetrics() {
  await updateQueueMetrics();
  await updateDeadLetterCount();

  let output = "# HELP taskpilot_workflow_executions_total Total number of workflow executions\n";
  output += "# TYPE taskpilot_workflow_executions_total counter\n";
  output += `taskpilot_workflow_executions_total ${metrics.workflowExecutions.total}\n\n`;

  output += "# HELP taskpilot_workflow_executions_completed Total number of completed workflow executions\n";
  output += "# TYPE taskpilot_workflow_executions_completed counter\n";
  output += `taskpilot_workflow_executions_completed ${metrics.workflowExecutions.completed}\n\n`;

  output += "# HELP taskpilot_workflow_executions_failed Total number of failed workflow executions\n";
  output += "# TYPE taskpilot_workflow_executions_failed counter\n";
  output += `taskpilot_workflow_executions_failed ${metrics.workflowExecutions.failed}\n\n`;

  output += "# HELP taskpilot_workflow_executions_skipped Total number of skipped workflow executions (duplicates)\n";
  output += "# TYPE taskpilot_workflow_executions_skipped counter\n";
  output += `taskpilot_workflow_executions_skipped ${metrics.workflowExecutions.skipped}\n\n`;

  output += "# HELP taskpilot_dead_letter_jobs Current number of jobs in dead-letter queue\n";
  output += "# TYPE taskpilot_dead_letter_jobs gauge\n";
  output += `taskpilot_dead_letter_jobs ${metrics.deadLetterJobs}\n\n`;

  output += "# HELP taskpilot_queue_waiting_jobs Current number of waiting jobs in workflow queue\n";
  output += "# TYPE taskpilot_queue_waiting_jobs gauge\n";
  output += `taskpilot_queue_waiting_jobs ${metrics.queueSizes.waiting}\n\n`;

  output += "# HELP taskpilot_queue_active_jobs Current number of active jobs in workflow queue\n";
  output += "# TYPE taskpilot_queue_active_jobs gauge\n";
  output += `taskpilot_queue_active_jobs ${metrics.queueSizes.active}\n\n`;

  output += "# HELP taskpilot_queue_completed_jobs Current number of completed jobs in workflow queue\n";
  output += "# TYPE taskpilot_queue_completed_jobs gauge\n";
  output += `taskpilot_queue_completed_jobs ${metrics.queueSizes.completed}\n\n`;

  output += "# HELP taskpilot_queue_failed_jobs Current number of failed jobs in workflow queue\n";
  output += "# TYPE taskpilot_queue_failed_jobs gauge\n";
  output += `taskpilot_queue_failed_jobs ${metrics.queueSizes.failed}\n`;

  return output;
}

module.exports = {
  incrementWorkflowExecution,
  getPrometheusMetrics,
};
