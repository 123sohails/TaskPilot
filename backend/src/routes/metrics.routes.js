const express = require("express");
const router = express.Router();
const { getPrometheusMetrics } = require("../services/metrics.service");

// Prometheus metrics endpoint
router.get("/", async (req, res) => {
  try {
    const metrics = await getPrometheusMetrics();
    res.set("Content-Type", "text/plain");
    res.send(metrics);
  } catch (error) {
    console.error("Error generating metrics:", error);
    res.status(500).send("Error generating metrics");
  }
});

module.exports = router;
