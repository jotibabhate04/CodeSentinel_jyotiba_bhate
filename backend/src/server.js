const app = require('./app');
const { initializeDatabase } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('[Server] Connecting to MySQL database...');
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`[Server] CodeSentinel Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`[Server] Base API: http://localhost:${PORT}/api`);
      console.log(`[Server] Health Check: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('\n[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('[Server] Fatal startup error:', error.message);
    process.exit(1);
  }
};

startServer().catch((error) => {
    console.error('[Server] Unhandled startup error:', error);
    process.exit(1);
});
