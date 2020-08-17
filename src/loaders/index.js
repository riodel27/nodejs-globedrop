const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");
const Logger = require("./logger");

module.exports.init = async ({ expressApp, config }) => {
  // initialize database
  await mongooseLoader(config.database.url);
  Logger.info("MongoDB Initialized");

  // Logger.info("✌️ DB loaded and connected!");

  await expressLoader({ app: expressApp, config });
  Logger.info("Express Initialized");

  // ... more loaders can be here

  // ... Initialize agenda
  // ... or Redis, or whatever you want
};
