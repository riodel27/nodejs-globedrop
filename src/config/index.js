require("dotenv").config();

module.exports = {
  development: {
    port: 3000,
    logLevel: "debug",
    nodeEnv: "development",
    database: {
      url: "mongodb://localhost:27017/globedrop",
    },
    accessTokenTtl: "24",
    secretToken: "globedrop",
    secretRefreshToken: "globedrop123",
    refreshTokenTtl: "30d",
  },
  production: {},
  staging: {},
};
