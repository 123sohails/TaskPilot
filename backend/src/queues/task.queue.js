const { Queue } = require("bullmq");
const Redis = require("ioredis");

let redisConnection;
let workflowQueue;
let deadLetterQueue;

if (process.env.NODE_ENV === 'test') {
  // Mock implementations for tests to avoid ECONNREFUSED
  const store = new Map();
  redisConnection = {
    exists: async (key) => store.has(key) ? 1 : 0,
    set: async (key, value, mode, duration) => store.set(key, value)
  }; 
  workflowQueue = { add: async () => ({ id: 'mock-job-123' }) };
  deadLetterQueue = { add: async () => ({ id: 'mock-dlq-123' }) };
} else {
  // Redis Connection
  redisConnection = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379",
    {
      maxRetriesPerRequest: null,
    }
  );

  // Main Workflow Queue
  workflowQueue = new Queue("workflows", {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        count: 1000,
        age: 24 * 60 * 60, // 1 day
      },
      removeOnFail: {
        count: 5000,
        age: 7 * 24 * 60 * 60, // 7 days
      },
    },
  });

  // Dead Letter Queue (DLQ)
  // Queue names MUST NOT contain ":" in BullMQ
  deadLetterQueue = new Queue("workflows-dead-letter", {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: {
        count: 1000,
        age: 30 * 24 * 60 * 60, // 30 days
      },
      removeOnFail: {
        count: 5000,
        age: 90 * 24 * 60 * 60, // 90 days
      },
    },
  });
}

module.exports = {
  workflowQueue,
  deadLetterQueue,
  redisConnection,
};