const { redisConnection } = require("../queues/task.queue");

const IDEMPOTENCY_PREFIX = "idempotency:";
const IDEMPOTENCY_TTL = 24 * 60 * 60; // 24 hours in seconds

class IdempotencyService {
  /**
   * Check if an event with the given idempotency key has already been processed
   * @param {string} idempotencyKey - Unique key for the event
   * @returns {Promise<boolean>} - true if already processed, false otherwise
   */
  async isProcessed(idempotencyKey) {
    const key = `${IDEMPOTENCY_PREFIX}${idempotencyKey}`;
    const exists = await redisConnection.exists(key);
    return exists === 1;
  }

  /**
   * Mark an event as processed with the given idempotency key
   * @param {string} idempotencyKey - Unique key for the event
   * @param {object} metadata - Optional metadata to store with the key
   * @returns {Promise<boolean>} - true if marked successfully, false if already exists
   */
  async markProcessed(idempotencyKey, metadata = {}) {
    const key = `${IDEMPOTENCY_PREFIX}${idempotencyKey}`;
    
    // Use SETNX to only set if key doesn't exist (atomic operation)
    const result = await redisConnection.set(key, JSON.stringify({
      processedAt: new Date().toISOString(),
      ...metadata
    }), "NX", "EX", IDEMPOTENCY_TTL);
    
    return result === "OK";
  }

  /**
   * Get metadata for a processed event
   * @param {string} idempotencyKey - Unique key for the event
   * @returns {Promise<object|null>} - Metadata object or null if not found
   */
  async getMetadata(idempotencyKey) {
    const key = `${IDEMPOTENCY_PREFIX}${idempotencyKey}`;
    const data = await redisConnection.get(key);
    
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate an idempotency key from event data
   * @param {object} eventData - Event data to generate key from
   * @returns {string} - Generated idempotency key
   */
  static generateKey(eventData) {
    // Create a hash of relevant event properties
    const crypto = require("crypto");
    const normalized = JSON.stringify(eventData, Object.keys(eventData).sort());
    return crypto.createHash("sha256").update(normalized).digest("hex");
  }
}

module.exports = new IdempotencyService();
