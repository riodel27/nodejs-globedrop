const dependencyInjectorLoader = require("./dependencyInjector");
const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");
const redisLoader = require("./redis");

const Logger = require("./logger");

module.exports.init = async ({ expressApp, config }) => {
  const mongoConnection = await mongooseLoader(config.database.url);
  Logger.info("✌️ DB loaded and connected!");

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  const userModel = {
    name: "userModel",
    model: require("../models/user.model"),
  };

  const organizationModel = {
    name: "organizationModel",
    model: require("../models/organization.model"),
  };

  // comment this if you don't need redis loader...
  const redisClient = await redisLoader(config.redisPort);
  Logger.info("✌️ Redis loaded and connected!");

  // ... more loaders can be here

  await dependencyInjectorLoader({
    config,
    redisClient, // comment this if you don't need redis...
    models: [userModel, organizationModel],
  });
  Logger.info("✌️ Dependency Injector loaded");

  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
