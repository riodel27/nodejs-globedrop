const express = require('express')
const passport = require('passport')

const middlware = require('../middlewares')
const UserController = require('../../controllers/user.controller')

const router = express.Router()

module.exports = () => {
   router.post('/', UserController.validate('createUser'), UserController.createUser)

   router.post('/login', passport.authenticate('local'), (req, res) => {
      return res.status(200).json({
         user: req.user.user,
         access_token: req.user.access_token,
         refresh_token: req.user.refresh_token,
         expires_in: req.user.expires_in,
      })
   })

   router.post('/logout', UserController.logout)

   router.get('/token/:refresh_token', UserController.refreshToken)

   router.use(middlware.isAuthenticated)

   router.get('/:id', UserController.validate('getUserById'), UserController.getUserById)

   router.get('/:id/organizations', UserController.getOrganizationsByUser)

   router.put('/:id', UserController.validate('updateUser'), UserController.updateUser)

   router.delete('/:id', UserController.validate('deleteUser'), UserController.deleteUser)

   return router
}
