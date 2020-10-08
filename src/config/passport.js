/* eslint-disable no-underscore-dangle */
const passport = require('passport')
const pLocal = require('passport-local')
const pFacebook = require('passport-facebook')
const { Container } = require('typedi')

const LocalStrategy = pLocal.Strategy
const FacebookStrategy = pFacebook.Strategy

const config = Container.get('config')

passport.use(
   new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
         const logger = Container.get('logger')
         logger.debug('calling passport local strategy')

         try {
            const UserServiceInstance = Container.get('user.service')
            const user = await UserServiceInstance.login(email, password)
            done(null, user)
         } catch (e) {
            logger.error(e)
            done(e)
         }
      },
   ),
)

passport.use(
   new FacebookStrategy(
      {
         clientID: config.facebook.oauth.clientId,
         clientSecret: config.facebook.oauth.secret,
         callbackURL: config.facebook.oauth.callback,
         profileFields: ['id', 'emails', 'name'],
      },
      async function (_, __, profile, done) {
         const logger = Container.get('logger')
         logger.debug('calling facebook authentication')
         try {
            const UserServiceInstance = Container.get('user.service')

            const user = await UserServiceInstance.facebookAuthentication(profile)

            done(null, user)
         } catch (error) {
            logger.error(error)
            done(error)
         }
      },
   ),
)

passport.serializeUser(({ user }, done) => done(null, user._id))

passport.deserializeUser(async (user_id, done) => {
   const logger = Container.get('logger')
   try {
      const UserServiceInstance = Container.get('user.service')
      const user = await UserServiceInstance.deserializeUser(user_id)
      done(null, user)
   } catch (e) {
      logger.error(e)
      done(e)
   }
})
