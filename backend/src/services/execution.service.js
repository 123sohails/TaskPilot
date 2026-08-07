const crypto = require("crypto");
const supabase = require("../config/supabase");
const { workflowQueue } = require("../queues/task.queue");

function buildIdempotencyKey(workflowId, triggerData = {}) {
  const normalizedPayload = {
    workflowId,
    triggerData: triggerData && typeof triggerData === "object"
      ? triggerData
      : { value: triggerData },
  };

  const serialized = JSON.stringify(normalizedPayload, Object.keys(normalizedPayload).sort());
  return `taskpilot:${crypto.createHash("sha256").update(serialized).digest("hex")}`;
}

/**
 * Create a new execution record and queue it for processing
 */
async function runWorkflow(workflowId, userId, triggerData = {}) {
  try {
    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .select(
        `
        *,
        workflow_steps (*)
      `
      )
      .eq("id", workflowId)
      .eq("user_id", userId)
      .single();

    if (workflowError) {
      throw new Error(`Workflow not found: ${workflowError.message}`);
    }

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const sortedSteps = [...(workflow.workflow_steps || [])].sort(
      (a, b) => a.step_order - b.step_order
    );

    const idempotencyKey = buildIdempotencyKey(workflowId, triggerData);

    const { data: execution, error: executionError } = await supabase
      .from("executions")
      .insert({
        workflow_id: workflowId,
        status: "pending",
        started_at: new Date().toISOString(),
        logs: JSON.stringify({
          message: "Execution created",
          triggerData,
          idempotencyKey,
        }),
      })
      .select()
      .single();

    if (executionError) {
      throw new Error(`Failed to create execution: ${executionError.message}`);
    }

    const job = await workflowQueue.add(
      "workflow-execution",
      {
        workflowId,
        triggerEvent: triggerData,
        idempotencyKey,
        steps: sortedSteps,
        executionId: execution.id,
        userId,
      },
      {
        jobId: `${workflowId}:${execution.id}`,
      }
    );

    const { data: queuedExecution, error: queueUpdateError } = await supabase
      .from("executions")
      .update({
        status: "queued",
        logs: JSON.stringify({
          message: "Workflow queued for execution",
          triggerData,
          idempotencyKey,
          queueJobId: job.id,
        }),
      })
      .eq("id", execution.id)
      .select()
      .single();

    if (queueUpdateError) {
      console.warn("Unable to update execution queue state:", queueUpdateError.message);
    }

    return {
      execution: queuedExecution || execution,
      workflow,
      steps: sortedSteps,
      jobId: job.id,
      idempotencyKey,
    };
  } catch (error) {
    throw new Error(`Failed to run workflow: ${error.message}`);
  }
}

/**
 * Get all executions for a user
 */
async function getExecutions(userId) {
  try {
    const { data: executions, error } = await supabase
      .from("executions")
      .select(
        `
        *,
        workflows (id, name, trigger_type)
      `
      )
      .eq("workflows.user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch executions: ${error.message}`);
    }

    return executions;
  } catch (error) {
    throw new Error(`Failed to get executions: ${error.message}`);
  }
}

/**
 * Get a single execution by ID
 */
async function getExecutionById(executionId) {
  try {
    const { data: execution, error } = await supabase
      .from("executions")
      .select(
        `
        *,
        workflows (id, name, trigger_type, user_id)
      `
      )
      .eq("id", executionId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch execution: ${error.message}`);
    }

    if (!execution) {
      throw new Error("Execution not found");
    }

    return execution;
  } catch (error) {
    throw new Error(`Failed to get execution: ${error.message}`);
  }
}

/**
 * Update execution status and logs
 */
async function updateExecution(executionId, status, logs) {
  try {
    const { data: execution, error } = await supabase
      .from("executions")
      .update({
        status,
        logs: typeof logs === "string" ? logs : JSON.stringify(logs),
        finished_at: status === "completed" || status === "failed" || status === "skipped" ? new Date().toISOString() : null,
      })
      .eq("id", executionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update execution: ${error.message}`);
    }

    return execution;
  } catch (error) {
    throw new Error(`Failed to update execution: ${error.message}`);
  }
}

module.exports = {
  runWorkflow,
  getExecutions,
  getExecutionById,
  updateExecution,
  buildIdempotencyKey,
};
