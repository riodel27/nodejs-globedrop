const express = require("express");

const UserController = require("../../controllers/user.controller");

const router = express.Router();

module.exports = (params) => {
  const { user_service: UserService } = params;

  router.get(
    "/:id",
    // middlewares.isAuthenticated,
    UserController.validate("getUserById"),
    UserController.getUserById(UserService)
  );

  router.post(
    "/",
    // middlewares.isAuthenticated,
    UserController.validate("createUser"),
    UserController.createUser(UserService)
  );

  router.put(
    "/:id",
    // middlewares.isAuthenticated,
    UserController.validate("updateUser"),
    UserController.updateUser(UserService)
  );

  router.delete(
    "/:id",
    // middlewares.isAuthenticated,
    UserController.validate("deleteUser"),
    UserController.deleteUser(UserService)
  );

  return router;
};
