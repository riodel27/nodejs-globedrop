/* eslint-disable no-underscore-dangle */
const passport = require('passport')
const pLocal = require('passport-local')
const { Container } = require('typedi')

const LocalStrategy = pLocal.Strategy

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
