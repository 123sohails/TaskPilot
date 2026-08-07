process.env.NODE_ENV = 'test';
require("dotenv").config();
const test = require("node:test");
const assert = require("node:assert/strict");
const supabase = require("../src/config/supabase");
const { runWorkflow } = require("../src/services/execution.service");
const { workflowWorkerProcessor } = require("../src/workers/task.worker");

const crypto = require("crypto");

test("Execute whole workflow end-to-end", async () => {
  // 1. Setup mock user and workflow
  const workflowId = crypto.randomUUID();
  let userId;
  
  try {
    console.log("Creating test user...");
    const { data: userResp, error: userError } = await supabase.auth.admin.createUser({
      email: `test-${Date.now()}@example.com`,
      password: "password123",
      email_confirm: true
    });
    if (userError) throw new Error("User creation failed: " + userError.message);
    userId = userResp.user.id;

    console.log("Creating test workflow...");
    // Create workflow
    const { error: wError } = await supabase.from("workflows").insert({
      id: workflowId,
      user_id: userId,
      name: "E2E Test Workflow",
      trigger_type: "manual"
    });
    if (wError) throw new Error("Workflow insert failed: " + wError.message);

    // Create steps (delay -> mock http)
    const { error: sError } = await supabase.from("workflow_steps").insert([
      {
        workflow_id: workflowId,
        step_order: 1,
        step_type: "delay",
        config: { duration: 100 }
      },
      {
        workflow_id: workflowId,
        step_order: 2,
        step_type: "http_request",
        config: { url: "https://jsonplaceholder.typicode.com/todos/1", method: "GET" }
      }
    ]);
    if (sError) throw new Error("Steps insert failed: " + sError.message);

    console.log("Triggering workflow execution...");
    // 2. Trigger workflow (this creates execution and adds to mock queue since NODE_ENV='test')
    // Wait, we need to ensure the worker logic is tested. 
    // We can call runWorkflow, get the execution, then manually feed it to the processor.
    
    // We will bypass the bullmq queue and directly invoke the worker's processor logic
    const { execution, steps, idempotencyKey } = await runWorkflow(workflowId, userId, { manual: true });
    
    assert.ok(execution.id, "Execution should be created");
    assert.equal(execution.status, "queued", "Execution should be in queued status");
    
    console.log("Processing job with worker...");
    // 3. Run the worker process
    const mockJob = {
      id: "mock-job-id",
      data: {
        workflowId,
        triggerEvent: { manual: true },
        idempotencyKey,
        steps,
        executionId: execution.id
      },
      attemptsMade: 0,
      log: console.log
    };
    
    const result = await workflowWorkerProcessor(mockJob);
    
    assert.equal(result.status, "completed", "Worker should return completed status");
    assert.equal(result.steps.length, 2, "Worker should process 2 steps");
    assert.equal(result.steps[0].status, "success", "Step 1 should succeed");
    assert.equal(result.steps[1].status, "success", "Step 2 should succeed");
    
    console.log("Validating execution state in DB...");
    // 4. Verify the database execution status
    const { data: finalExecution } = await supabase
      .from("executions")
      .select("*")
      .eq("id", execution.id)
      .single();
      
    assert.equal(finalExecution.status, "completed", "Database status should be updated to completed");
    
    const parsedLogs = JSON.parse(finalExecution.logs);
    assert.ok(parsedLogs.steps.length === 2, "Logs should contain step results");

    console.log("✅ Whole workflow tested successfully end-to-end!");
  } finally {
    // Cleanup
    console.log("Cleaning up test data...");
    await supabase.from("workflow_steps").delete().eq("workflow_id", workflowId);
    await supabase.from("executions").delete().eq("workflow_id", workflowId);
    await supabase.from("workflows").delete().eq("id", workflowId);
    if (userId) {
      await supabase.auth.admin.deleteUser(userId);
    }
  }
});
