/** Business logic here... */

class OrganizationService {
  constructor(container) {
    this.organization = container.get("organizationModel");
  }

  async createOrganization(data, options = {}) {
    const organization = await this.organization.create(data);
    return organization;
  }

  async deleteOrganization(filter) {
    const organization = await this.organization.deleteOne(filter);
    return organization;
  }

  async findAdminsByOrganization(query, options = {}) {
    const organization = await this.organization
      .findOne(query)
      .populate(options.populate && "User");

    return organization.admins;
  }

  async findOneOrganization(query, options = {}) {
    const organization = await this.organization.findOne(query);

    return organization;
  }

  async findOneOrganizationAndUpdate(filter, data, options = {}) {
    const organization = await this.organization.findOneAndUpdate(
      filter,
      data,
      {
        new: true,
        ...options,
      }
    );

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

      const organizations = await this.organization.find(query, null, {
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
