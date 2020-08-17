const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");

module.exports.init = async ({ expressApp, config }) => {
  // initialize database
  await mongooseLoader(config.database.url);
  console.log("MongoDB Initialized");

  await expressLoader({ app: expressApp, config });
  console.log("Express Initialized");

  // ... more loaders can be here

  // ... Initialize agenda
  // ... or Redis, or whatever you want
};
