const express = require("express");

const middlware = require("../middlewares");

const UserController = require("../../controllers/user.controller");

const router = express.Router();

module.exports = (params) => {
  const { config, user_service: UserService } = params;

  router.post(
    "/",
    UserController.validate("createUser"),
    UserController.createUser(UserService)
  );

  router.post("/login", UserController.login(UserService, config));

  router.post("/logout", UserController.logout(/*BlackListTokenService*/));

  router.post("/token/:refresh_token", UserController.refreshToken(config));

  /** authenticated route/s */

  router.use(middlware.isAuthenticated);

  router.get(
    "/:id",
    UserController.validate("getUserById"),
    UserController.getUserById(UserService)
  );

  router.get(
    "/:id/organizations",
    UserController.getOrganizationsByUser(UserService)
  );

  router.put(
    "/:id",
    UserController.validate("updateUser"),
    UserController.updateUser(UserService)
  );

  router.delete(
    "/:id",
    UserController.validate("deleteUser"),
    UserController.deleteUser(UserService)
  );

  return router;
};
