const app = require("./src/app");
const server = require("http").createServer(app);
//import clusters
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const {log4js, SERVER} = require("./src/config/config.index");

if (SERVER.MODE.toLowerCase().trim() === "cluster") {
  if (cluster.isPrimary) {
    log4js.consoleLogger.info(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      if (signal) {
        log4js.consoleLogger.info(
          `worker ${worker.process.pid} was killed by signal: ${signal}`
        );
      } else if (code !== 0) {
        log4js.consoleLogger.info(
          `worker ${worker.process.pid} exited with error code: ${code}`
        );
      } else {
        log4js.consoleLogger.info("worker success!");
      }
    });
  } else {
    server.listen(SERVER.PORT, () => {
      log4js.consoleLogger.info(`Server running on port ${SERVER.PORT}`);
    });
  }
} else {
  server.listen(SERVER.PORT, () => {
    log4js.consoleLogger.info(`Server running on port ${SERVER.PORT}`);
  });
}
