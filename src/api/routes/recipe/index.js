const express = require('express')
const { Container } = require('typedi')

const router = express.Router()

module.exports = () => {
   // third party api - for redis demo caching...
   router.get('/:fooditem', async (req, res) => {
      const logger = Container.get('logger')
      logger.debug('Calling get recipe endpoint with parameter: ', req.params)
      try {
         const { fooditem } = req.params

         const FoodRecipeServiceInstance = Container.get('foodRecipe.service')

         const recipes = await FoodRecipeServiceInstance.getRecipesByFoodItem(fooditem)

         logger.info(`${req.method} ${req.originalUrl} ${200}`)

         return res.status(200).json(recipes)
      } catch (error) {
         console.log(error)
      }
   })

   return router
}
