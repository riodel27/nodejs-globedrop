const loaders = require("./loaders");
const express = require("express");

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
    console.log(`Your server is ready !`);
  });
}

startServer();
