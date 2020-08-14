const express = require("express");
const middleware = require("./middlewares");

// Require the index file
const userRoute = require("./user");

// controllers
const UserController = require("../controllers/user.controller");

const router = express.Router();

module.exports = (params) => {
  const { user_service: UserService } = params;

  router.use("/user", userRoute(params));

  router.use(middleware.isAuthenticated);

  router.get("/users", UserController.getUsers(UserService));

  router.get(
    "/users/:user_type",
    UserController.getUsersByUserType(UserService)
  );

  return router;
};
