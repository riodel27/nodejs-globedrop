const redis = require("redis");

const Logger = require("./logger");

module.exports = (port) => {
  return new Promise((resolve, _) => {
    const client = redis.createClient(port);

    client.on("error", (error) => {
      Logger.error(error);
      process.exit(1);
    });

    client.on("connect", () => {
      resolve(client);
    });
  });
};
