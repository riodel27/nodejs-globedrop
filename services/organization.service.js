/* eslint-disable no-underscore-dangle */
const { groupBy: _groupBy } = require("lodash");
const { not } = require("ramda");
const mongoose = require("mongoose");

/** Business logic here */

class OrganizationService {
  constructor(organization, config) {
    this.model = organization;
    this.config = config;
  }

  async createOrganization(data, options = {}) {
    const organization = await this.model.create(data);
    return organization;
  }

  async deleteOrganization(filter) {
    const organization = await this.model.deleteOne(filter);
    return organization;
  }

  async findAdminsByOrganization(query, options = {}) {
    const organization = await this.model
      .findOne(query)
      .populate(options.populate && "User");

    return organization.admins;
  }

  async findOneOrganization(query, options = {}) {
    const organization = await this.model.findOne(query);

    return organization;
  }

  async findOneOrganizationAndUpdate(filter, data, options = {}) {
    const organization = await this.model.findOneAndUpdate(filter, data, {
      new: true,
      ...options,
    });

    return organization;
  }

  async list(options) {
    try {
      const {
        filter: Filter,
        offset: Offset,
        max,
        sortby: SortBy,
        sortorder: SortOrder,
      } = options;

      const query =
        Filter && Filter.trim()
          ? {
              $text: { $search: Filter.trim() },
            }
          : {};

      const offset = Offset ? Number(JSON.parse(Offset)) : 0;
      const limit = max ? Number(JSON.parse(max)) : 10;
      // const sortby = userSortByScope(SortBy ? SortBy.toLowerCase() : "f");
      // const sortorder = sortOrder(SortOrder ? SortOrder.toLowerCase() : "a");

      const organizations = await this.model.find(query, null, {
        // sort: { [sortby]: sortorder },
        skip: offset,
        limit: limit,
      });
      // .populate("profession")
      // .populate("role");

      return organizations;
    } catch (error) {
      throw Error(error);
    }
  }
}

module.exports = OrganizationService;
