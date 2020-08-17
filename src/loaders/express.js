const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const { isArray: _isArray } = require("lodash");

const logger = require("./logger");
const middleware = require("../utils/middleware");
const swaggerSpec = require("../utils/swagger");

const routes = require("../api/routes");

// models
const UserModel = require("../models/user.model");
const OrganizationModel = require("../models/organization.model");

// services
const UserService = require("../services/user.service");
const OrganizationService = require("../services/organization.service");

module.exports = async ({ app, config }) => {
  app.use(
    require("morgan")(config.nodeEnv !== "production" ? "dev" : "combined")
  );

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // TODO: study dependency injection

  /**Instantiate Services once and pass Models */
  const user_service = new UserService(UserModel, config);
  const organization_service = new OrganizationService(
    OrganizationModel,
    config
  );

  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(middleware.cors);

  // ...More middlewares

  // Load API routes
  app.use(
    config.api.prefix,
    routes({
      config,
      organization_service,
      user_service,
    })
  );

  app.get("/", (_, res) => res.send("NGO Directory App"));

  // error
  app.use((err, req, res, next) => {
    // Fallback to default node handler
    if (res.headersSent) {
      next(err);
      return;
    }

    logger.error(err.message, {
      url: req.originalUrl,
      meta: {
        code: err.code,
        method: req.method,
        path: req.path,
        route: req.route,
        body: req.body,
        params: req.params,
        query: req.query,
        ip:
          (req.headers && req.headers["x-forwarded-for"]) ||
          (req.connection && req.connection.remoteAddress) ||
          (req.socket && req.socket.remoteAddress) ||
          (req.connection &&
            (req.connection.socket
              ? req.connection.socket.remoteAddress
              : null)),
        status: err.status || 500,
      },
    });
    if (err.code === "BAD_USER_INPUT") {
      const errors = JSON.parse(err.message);
      res
        .status(err.status || 422)
        .json(_isArray(errors) ? { errors } : errors);
      return;
    }

    if (err.code === "BAD_INPUT") {
      const errors = JSON.parse(err.message);
      res.status(err.status || 422).json({ errors });
      return;
    }

    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });

  return app;
};
