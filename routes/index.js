const express = require("express");
const middleware = require("./middlewares");

// Require the index file
const organizationRoute = require("./organization");
const userRoute = require("./user");

// controllers
const OrganizationController = require("../controllers/organization.controller");
const UserController = require("../controllers/user.controller");

const router = express.Router();

module.exports = (params) => {
  const { user_service: UserService } = params;

  router.use("/organization", organizationRoute(params));
  router.use("/user", userRoute(params));

  router.use(middleware.isAuthenticated);

  router.get("/organizations", OrganizationController.getOrganizations(params));
  router.get("/users", UserController.getUsers(UserService));

  router.get(
    "/users/:user_type",
    UserController.getUsersByUserType(UserService)
  );

  return router;
};
