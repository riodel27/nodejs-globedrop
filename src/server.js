const express = require("express");

const loaders = require("./loaders");
const logger = require("./loaders/logger");
const config = require("./config")[process.env.NODE_ENV || "development"];

const { normalizePort } = require("./utils/helper");

async function startServer() {
  const app = express();

  await loaders.init({ expressApp: app, config });

  const port = normalizePort(config.port || "3000");

  app.listen(port, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    logger.info("Your server is ready !");
  });
}

startServer();
