require("dotenv").config();

const app = require("./app");


const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 TaskPilot Backend running on port ${PORT}`);
});