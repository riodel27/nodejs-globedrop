const express = require("express");
const middleware = require("./middlewares");

// require the index file
const organizationRoute = require("./organization");
const userRoute = require("./user");

// controllers
const OrganizationController = require("../controllers/organization.controller");
const UserController = require("../controllers/user.controller");

const router = express.Router();

module.exports = () => {
  router.use("/organization", organizationRoute());
  router.use("/user", userRoute());

  router.use(middleware.isAuthenticated);

  router.get("/organizations", OrganizationController.getOrganizations);
  router.get("/users", UserController.getUsers);

  router.get("/users/:user_type", UserController.getUsersByUserType);

  return router;
};
