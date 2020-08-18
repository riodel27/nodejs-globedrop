const { Container } = require("typedi");

const OrganizationService = require("../services/organization.service");
const UserService = require("../services/user.service");

const LoggerInstance = require("./logger");

module.exports = async ({ config, models }) => {
  try {
    models.forEach((m) => {
      Container.set(m.name, m.model);
    });

    Container.set("config", config);
    Container.set("logger", LoggerInstance);

    Container.set("organization.service", new OrganizationService(Container));
    Container.set("user.service", new UserService(Container));

    return;
  } catch (error) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", error);
    throw error;
  }
};
