const supabase = require("../config/supabase");

/**
 * Create a new execution record
 * Note: Queue integration will be handled by Saleem's worker service
 */
async function runWorkflow(workflowId, userId, triggerData = {}) {
  try {
    // Fetch workflow with steps
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

    // Sort steps by order
    const sortedSteps = workflow.workflow_steps.sort(
      (a, b) => a.step_order - b.step_order
    );

    // Create execution record
    const { data: execution, error: executionError } = await supabase
      .from("executions")
      .insert({
        workflow_id: workflowId,
        status: "pending",
        started_at: new Date().toISOString(),
        logs: JSON.stringify({
          message: "Execution created",
          triggerData,
        }),
      })
      .select()
      .single();

    if (executionError) {
      throw new Error(`Failed to create execution: ${executionError.message}`);
    }

    // Return execution data for queue integration
    return {
      execution,
      workflow,
      steps: sortedSteps,
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
        logs: JSON.stringify(logs),
        finished_at: status === "completed" || status === "failed" ? new Date().toISOString() : null,
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
};
