/**
 * Request validation middleware
 * Validates request body against expected schema
 */

/**
 * Validate workflow creation/update
 */
function validateWorkflow(req, res, next) {
  const { name, description, trigger_type } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Workflow name is required and must be a non-empty string",
    });
  }

  if (description && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Workflow description must be a string",
    });
  }

  if (trigger_type && typeof trigger_type !== "string") {
    return res.status(400).json({
      success: false,
      message: "Trigger type must be a string",
    });
  }

  next();
}

/**
 * Validate workflow step creation/update
 */
function validateWorkflowStep(req, res, next) {
  const { step_order, step_type, config } = req.body;

  if (step_order === undefined || typeof step_order !== "number") {
    return res.status(400).json({
      success: false,
      message: "Step order is required and must be a number",
    });
  }

  if (!step_type || typeof step_type !== "string") {
    return res.status(400).json({
      success: false,
      message: "Step type is required and must be a string",
    });
  }

  const validStepTypes = [
    "github_trigger",
    "ai_summarize",
    "ai_classify",
    "ai_decision",
    "notion_create_page",
    "gmail_send",
    "github_create_issue",
  ];

  if (!validStepTypes.includes(step_type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid step type. Must be one of: ${validStepTypes.join(", ")}`,
    });
  }

  if (config && typeof config !== "object") {
    return res.status(400).json({
      success: false,
      message: "Step config must be an object",
    });
  }

  next();
}

/**
 * Validate execution run request
 */
function validateExecutionRun(req, res, next) {
  const { triggerData } = req.body;

  if (triggerData && typeof triggerData !== "object") {
    return res.status(400).json({
      success: false,
      message: "Trigger data must be an object",
    });
  }

  next();
}

/**
 * Generic validation factory function
 */
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }

        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(", ")}`);
        }

        if (rules.min && value.length < rules.min) {
          errors.push(`${field} must be at least ${rules.min} characters`);
        }

        if (rules.max && value.length > rules.max) {
          errors.push(`${field} must be at most ${rules.max} characters`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
}

module.exports = {
  validateWorkflow,
  validateWorkflowStep,
  validateExecutionRun,
  validate,
};
