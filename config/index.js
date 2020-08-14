require("dotenv").config();

module.exports = {
  development: {
    port: 3000,
    logLevel: "debug",
    nodeEnv: "development",
    database: {
      url: "mongodb://localhost:27017/globedrop",
    },
  },
  production: {},
  staging: {},
};
