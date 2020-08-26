const { Container } = require('typedi')

const OrganizationService = require('../services/organization.service')
const UserService = require('../services/user.service')

/** Third party API/Service... */
const FoodRecipeService = require('../services/third-party/food-recipe.service') // redis cache demonstration only...

const LoggerInstance = require('./logger')

module.exports = async ({ config, redisClient, models }) => {
   try {
      models.forEach((m) => {
         Container.set(m.name, m.model)
      })

      Container.set('config', config)
      Container.set('logger', LoggerInstance)
      redisClient && Container.set('redis.client', redisClient)

      Container.set('organization.service', new OrganizationService(Container))
      Container.set('user.service', new UserService(Container))
      Container.set('foodRecipe.service', new FoodRecipeService(Container))

      return
   } catch (error) {
      LoggerInstance.error('🔥 Error on dependency injector loader: %o', error)
      throw error
   }
}
