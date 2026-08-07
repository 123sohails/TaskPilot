process.env.NODE_ENV = 'test';
const test = require("node:test");
const assert = require("node:assert/strict");
const { buildIdempotencyKey } = require("../src/services/execution.service");

test("buildIdempotencyKey produces a stable key for workflow and trigger data", () => {
  const first = buildIdempotencyKey("workflow-123", {
    eventId: "evt-1",
    payload: { email: "test@example.com" },
  });
  const second = buildIdempotencyKey("workflow-123", {
    eventId: "evt-1",
    payload: { email: "test@example.com" },
  });

  assert.equal(first, second);
  assert.match(first, /^taskpilot:/);
});
