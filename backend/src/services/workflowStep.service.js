const supabase = require("../config/supabase");

/**
 * Add a step to a workflow
 */
async function addWorkflowStep(workflowId, stepData) {
  try {
    const { data: step, error } = await supabase
      .from("workflow_steps")
      .insert({
        workflow_id: workflowId,
        step_order: stepData.step_order,
        step_type: stepData.step_type,
        config: stepData.config || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add workflow step: ${error.message}`);
    }

    return step;
  } catch (error) {
    throw new Error(`Failed to add workflow step: ${error.message}`);
  }
}

/**
 * Get all steps for a workflow
 */
async function getWorkflowSteps(workflowId) {
  try {
    const { data: steps, error } = await supabase
      .from("workflow_steps")
      .select("*")
      .eq("workflow_id", workflowId)
      .order("step_order", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch workflow steps: ${error.message}`);
    }

    return steps;
  } catch (error) {
    throw new Error(`Failed to get workflow steps: ${error.message}`);
  }
}

/**
 * Get a single step by ID
 */
async function getWorkflowStepById(stepId) {
  try {
    const { data: step, error } = await supabase
      .from("workflow_steps")
      .select("*")
      .eq("id", stepId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch workflow step: ${error.message}`);
    }

    if (!step) {
      throw new Error("Workflow step not found");
    }

    return step;
  } catch (error) {
    throw new Error(`Failed to get workflow step: ${error.message}`);
  }
}

/**
 * Update a workflow step
 */
async function updateWorkflowStep(stepId, stepData) {
  try {
    const { data: step, error } = await supabase
      .from("workflow_steps")
      .update({
        step_order: stepData.step_order,
        step_type: stepData.step_type,
        config: stepData.config,
      })
      .eq("id", stepId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update workflow step: ${error.message}`);
    }

    return step;
  } catch (error) {
    throw new Error(`Failed to update workflow step: ${error.message}`);
  }
}

/**
 * Delete a workflow step
 */
async function deleteWorkflowStep(stepId) {
  try {
    const { error } = await supabase
      .from("workflow_steps")
      .delete()
      .eq("id", stepId);

    if (error) {
      throw new Error(`Failed to delete workflow step: ${error.message}`);
    }

    return { success: true, message: "Workflow step deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete workflow step: ${error.message}`);
  }
}

module.exports = {
  addWorkflowStep,
  getWorkflowSteps,
  getWorkflowStepById,
  updateWorkflowStep,
  deleteWorkflowStep,
};
