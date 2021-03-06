/** Business logic here... */

const { CustomError } = require('../utils/error')

class OrganizationService {
   constructor(container) {
      this.organization = container.get('organizationModel')
   }

   async createOrganization(userInput, options = {}) {
      const existingOrganization = await this.organization.findOne({
         org_name: userInput.org_name,
      })

      if (existingOrganization)
         throw new CustomError('ORGANIZATION_ALREADY_EXIST', 400, 'Organization already exist.')

      const organization = await this.organization.create(userInput)
      return organization
   }

   async deleteOrganization(filter) {
      const organization = await this.organization.deleteOne(filter)
      return organization
   }

   async findAdminsByOrganization(query, options = {}) {
      const organization = await this.organization
         .findOne(query)
         .populate(options.populate && 'User')

      return organization.admins
   }

   async findOneOrganization(query, options = {}) {
      const organization = await this.organization.findOne(query)

      return organization
   }

   async updateOrganization(id, userInput, options = {}) {
      if (userInput.org_name) {
         const existingOrganization = this.organization.findOne({
            org_name: userInput.org_name,
         })

         if (existingOrganization && existingOrganization.id !== id)
            throw new CustomError(
               'ORGANIZATION_ALREADY_EXIST',
               400,
               'organization name already exist.',
            )
      }

      const organization = await this.organization.findOneAndUpdate({ _id: id }, userInput, {
         new: true,
         ...options,
      })

      return organization
   }

   async list(options) {
      try {
         const {
            filter: Filter,
            offset: Offset,
            max,
            sortby: SortBy,
            sortorder: SortOrder,
         } = options

         const query =
            Filter && Filter.trim()
               ? {
                    $text: { $search: Filter.trim() },
                 }
               : {}

         const offset = Offset ? Number(JSON.parse(Offset)) : 0
         const limit = max ? Number(JSON.parse(max)) : 10
         // const sortby = userSortByScope(SortBy ? SortBy.toLowerCase() : "f");
         // const sortorder = sortOrder(SortOrder ? SortOrder.toLowerCase() : "a");

         const organizations = await this.organization.find(query, null, {
            // sort: { [sortby]: sortorder },
            skip: offset,
            limit: limit,
         })
         // .populate("profession")
         // .populate("role");

         return organizations
      } catch (error) {
         throw Error(error)
      }
   }
}

module.exports = OrganizationService
