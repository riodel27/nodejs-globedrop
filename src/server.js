const express = require("express");

const config = require("./config")[process.env.NODE_ENV || "development"];
const Logger = require("./loaders/logger");

const { normalizePort } = require("./utils/helper");

async function startServer() {
  const app = express();

  await require("./loaders").init({ expressApp: app, config });

  app.listen(normalizePort(config.port || "3000"), (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }

    Logger.info(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️ 
    ################################################
  `);
  });
}

startServer();
