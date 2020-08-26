const express = require('express')

const middleware = require('./middlewares')

const organizationRoute = require('./organization')
const userRoute = require('./user')
const recipeRoute = require('./recipe') // demo route for redis caching...

const OrganizationController = require('../controllers/organization.controller')
const UserController = require('../controllers/user.controller')

const router = express.Router()

module.exports = () => {
   router.use('/organization', organizationRoute())
   router.use('/user', userRoute())
   router.use('/recipe', recipeRoute()) // demo route for redis caching...

   router.use(middleware.isAuthenticated)

   router.get('/organizations', OrganizationController.getOrganizations)
   router.get('/users', UserController.getUsers)

   router.get('/users/:user_type', UserController.getUsersByUserType)

   return router
}
