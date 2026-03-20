const app = require("./app");
const env = require("./app/config/env");
const connectDB = require("./app/config/db");
const { connectRedis } = require("./app/config/redis");
const serverGracefulShutdown = require("./app/utils/serverGracefulShutdown");
const seedAdmin = require("./app/utils/seedAdmin");

let server;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    await seedAdmin();

    // Start Listening
    const port = env.PORT || 5000;
    server = app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });

    serverGracefulShutdown(server);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

module.exports = startServer;
