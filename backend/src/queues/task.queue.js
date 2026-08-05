const { Queue } = require("bullmq");
const Redis = require("ioredis");

// Redis Connection
const redisConnection = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  }
);

// Main Workflow Queue
const workflowQueue = new Queue("workflows", {
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
const deadLetterQueue = new Queue("workflows-dead-letter", {
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

module.exports = {
  workflowQueue,
  deadLetterQueue,
  redisConnection,
};