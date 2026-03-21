const serverGracefulShutdown = (server) => {
  const shutdown = (reason, err) => {
    console.log(
      `⚠️  ${reason} --> Server shutting down gracefully.`,
      err || "",
    );

    if (server) {
      server.close(() => {
        console.log("🔻 Server closed.");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM signal received"));
  process.on("SIGINT", () => shutdown("SIGINT signal received"));
  process.on("unhandledRejection", (err) =>
    shutdown("Unhandled Rejection detected", err),
  );
  process.on("uncaughtException", (err) =>
    shutdown("Uncaught Exception detected", err),
  );
};

module.exports = serverGracefulShutdown;
