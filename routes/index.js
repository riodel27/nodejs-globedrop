const express = require("express");
// const middlewares = require("./middlewares");

// Require the index file

const userRoute = require("./user");

// controllers
const UserController = require("../controllers/user.controller");

const router = express.Router();

module.exports = (params) => {
  const { config, user_service: UserService } = params;

  router.use("/user", userRoute(params));

  router.get(
    "/users",
    // middlewares.isAuthenticated,
    UserController.getUsers(UserService)
  );

  router.get(
    "/users/:user_type",
    // middlewares.isAuthenticated,
    UserController.getUsersByUserType(UserService)
  );

  return router;
};
