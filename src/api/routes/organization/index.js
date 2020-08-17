const express = require("express");

const middlware = require("../middlewares");

const OrganizationController = require("../../controllers/organization.controller");

const router = express.Router();

module.exports = (params) => {
  const { config, organization_service: OrganizationService } = params;

  router.use(middlware.isAuthenticated);

  router.post(
    "/",
    OrganizationController.validate("createOrganization"),
    OrganizationController.createOrganization(OrganizationService)
  );

  router.get(
    "/:id",
    OrganizationController.validate("getOrganizationById"),
    OrganizationController.getOrganizationById(OrganizationService)
  );

  router.get(
    "/:id/admins",
    OrganizationController.getAdminsByOrganization(OrganizationService)
  );

  router.put(
    "/:id",
    OrganizationController.validate("updateOrganization"),
    OrganizationController.updateOrganization(OrganizationService)
  );

  router.delete(
    "/:id",
    OrganizationController.validate("deleteOrganization"),
    OrganizationController.deleteOrganization(OrganizationService)
  );

  return router;
};
