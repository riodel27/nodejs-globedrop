const express = require("express");

const middlware = require("../middlewares");

const OrganizationController = require("../../controllers/organization.controller");

const router = express.Router();

module.exports = () => {
  router.use(middlware.isAuthenticated);

  router.post(
    "/",
    OrganizationController.validate("createOrganization"),
    OrganizationController.createOrganization
  );

  router.get(
    "/:id",
    OrganizationController.validate("getOrganizationById"),
    OrganizationController.getOrganizationById
  );

  router.get("/:id/admins", OrganizationController.getAdminsByOrganization);

  router.put(
    "/:id",
    OrganizationController.validate("updateOrganization"),
    OrganizationController.updateOrganization
  );

  router.delete(
    "/:id",
    OrganizationController.validate("deleteOrganization"),
    OrganizationController.deleteOrganization
  );

  return router;
};
