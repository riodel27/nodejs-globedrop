const express = require('express')
const passport = require('passport')

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

   router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))

   router.get(
      '/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' /** todo */ }),
      (req, res) => {
         return res.status(200).json({
            user: req.user.user,
            access_token: req.user.access_token,
         })
      },
   )

   router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

   router.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/fail' /** todo */ }),
      function (req, res) {
         return res.status(200).json({
            user: req.user.user,
            access_token: req.user.access_token,
         })
      },
   )

   router.use(middleware.isAuthenticated)

   router.get('/organizations', OrganizationController.getOrganizations)
   router.get('/users', UserController.getUsers)
   router.get('/users/:user_type', UserController.getUsersByUserType)

   return router
}
