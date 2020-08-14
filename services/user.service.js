/* eslint-disable no-underscore-dangle */
const { groupBy: _groupBy } = require("lodash");
const { not } = require("ramda");
const mongoose = require("mongoose");

const { SendEmail, sortOrder, userSortByScope } = require("../utils/helper");

/**Business logic here */

class UserService {
  constructor(user, config) {
    this.model = user;
    this.config = config;
  }

  async createUser(data, options = {}) {
    const user = await this.model.create(data);
    return user;
  }

  async deleteUser(filter) {
    const user = await this.model.deleteOne(filter);
    return user;
  }

  async findOneUser(query, options = {}) {
    const user = await this.model
      .findOne(query)
      .populate(options.populate && "image")
      .populate(options.populate && "profession")
      .populate(options.populate && "role");

    return user;
  }

  async findOneUserAndUpdate(filter, data, options = {}) {
    const user = await this.model.findOneAndUpdate(filter, data, {
      new: true,
      ...options,
    });
    // .populate("profession");

    return user;
  }

  generatePassword() {
    return UserService.password();
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

      const users = await this.model.find(query, null, {
        // sort: { [sortby]: sortorder },
        skip: offset,
        limit: limit,
      });
      // .populate("profession")
      // .populate("role");

      return users;
    } catch (error) {
      throw Error(error);
    }
  }

  async listUsersByUserType(query, options = {}) {
    return await this.model.find(query);
  }

  static password() {
    return Math.random().toString(36).substring(2, 15);
  }
}

module.exports = UserService;
