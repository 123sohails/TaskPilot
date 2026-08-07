require("dotenv").config();
require("./workers/task.worker");

const app = require("./app");


const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 TaskPilot Backend running on port ${PORT}`);
});

// Start the workflow worker (in the same process for simplicity)
require("./workers/task.worker");