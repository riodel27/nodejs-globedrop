const express = require("express");

const middlware = require("../middlewares");

const UserController = require("../../controllers/user.controller");

const router = express.Router();

module.exports = () => {
  router.post(
    "/",
    UserController.validate("createUser"),
    UserController.createUser
  );

  router.post("/login", UserController.login);

  router.post("/logout", UserController.logout);

  router.post("/token/:refresh_token", UserController.refreshToken);

  router.use(middlware.isAuthenticated);

  router.get(
    "/:id",
    UserController.validate("getUserById"),
    UserController.getUserById
  );

  router.get("/:id/organizations", UserController.getOrganizationsByUser);

  router.put(
    "/:id",
    UserController.validate("updateUser"),
    UserController.updateUser
  );

  router.delete(
    "/:id",
    UserController.validate("deleteUser"),
    UserController.deleteUser
  );

  return router;
};
