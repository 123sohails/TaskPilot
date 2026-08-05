const supabase = require("../config/supabase");

/**
 * Create a new workflow
 */
async function createWorkflow(userId, workflowData) {
  try {
    const { data: workflow, error } = await supabase
      .from("workflows")
      .insert({
        user_id: userId,
        name: workflowData.name,
        description: workflowData.description,
        trigger_type: workflowData.trigger_type,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create workflow: ${error.message}`);
    }

    return workflow;
  } catch (error) {
    throw new Error(`Failed to create workflow: ${error.message}`);
  }
}

/**
 * Get all workflows for a user
 */
async function getWorkflows(userId) {
  try {
    const { data: workflows, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch workflows: ${error.message}`);
    }

    return workflows;
  } catch (error) {
    throw new Error(`Failed to get workflows: ${error.message}`);
  }
}

/**
 * Get a single workflow by ID
 */
async function getWorkflowById(workflowId) {
  try {
    const { data: workflow, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", workflowId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch workflow: ${error.message}`);
    }

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    return workflow;
  } catch (error) {
    throw new Error(`Failed to get workflow: ${error.message}`);
  }
}

/**
 * Update a workflow
 */
async function updateWorkflow(workflowId, workflowData) {
  try {
    const { data: workflow, error } = await supabase
      .from("workflows")
      .update({
        name: workflowData.name,
        description: workflowData.description,
        trigger_type: workflowData.trigger_type,
        status: workflowData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workflowId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update workflow: ${error.message}`);
    }

    return workflow;
  } catch (error) {
    throw new Error(`Failed to update workflow: ${error.message}`);
  }
}

/**
 * Delete a workflow
 */
async function deleteWorkflow(workflowId) {
  try {
    const { error } = await supabase
      .from("workflows")
      .delete()
      .eq("id", workflowId);

    if (error) {
      throw new Error(`Failed to delete workflow: ${error.message}`);
    }

    return { success: true, message: "Workflow deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete workflow: ${error.message}`);
  }
}

module.exports = {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
};
