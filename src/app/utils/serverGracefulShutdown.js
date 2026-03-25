const serverGracefulShutdown = (server) => {
  const shutdown = (reason, err) => {
    console.log(
      `⚠️  ${reason} --> Server shutting down gracefully.`,
      err || '',
    );

    if (server) {
      // Set a timeout to force exit if server.close() takes too long
      const forceExitTimeout = setTimeout(() => {
        console.log('💀 Forcefully shutting down (timeout).');
        process.exit(1);
      }, 5000);

      server.close(() => {
        clearTimeout(forceExitTimeout);
        console.log('🔻 Server closed.');
        process.exit(0);
      });
    } else {
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM signal received'));
  process.on('SIGINT', () => shutdown('SIGINT signal received'));
  process.on('SIGUSR2', () => shutdown('SIGUSR2 (nodemon) signal received'));
  process.on('unhandledRejection', (err) =>
    shutdown('Unhandled Rejection detected', err),
  );
  process.on('uncaughtException', (err) =>
    shutdown('Uncaught Exception detected', err),
  );
};

module.exports = serverGracefulShutdown;
