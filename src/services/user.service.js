const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { not } = require('ramda')
const { isObject } = require('lodash')

const config = require('../config')[process.env.NODE_ENV || 'development']

const { ForbiddenError, CustomError } = require('../utils/error')
const { jwtVerifyRefreshToken } = require('../utils/helper')

/** Business logic here... */

class UserService {
   constructor(container) {
      this.user = container.get('userModel')
      this.logger = container.get('logger')
   }

   async createUser(data, options = {}) {
      const existingUserEmail = await this.user.findOne({ email: data.email })

      if (existingUserEmail)
         throw new CustomError('EMAIL_ALREADY_EXIST', 400, 'User with this email already exist.')

      const user = await this.user.create(data)
      return user
   }

   async deleteUser(filter) {
      const user = await this.user.deleteOne(filter)
      return user
   }

   async findOneUser(query, options = {}) {
      const user = await this.user.findOne(query).populate(options.populate && 'Organization')

      if (not(user)) throw new CustomError('USER_NOT_FOUND', 404, 'User Not Found')

      return user
   }

   async findOrganizationsByUser(query, options = {}) {
      const user = await this.user.findOne(query).populate(options.populate && 'Organization')

      return user.organizations
   }

   async updateUser(id, userInput, options = {}) {
      if (userInput.email) {
         const existingUserEmail = await this.user.findOne({
            email: userInput.email,
         })

         if (existingUserEmail && existingUserEmail.id !== id)
            throw new CustomError('EMAIL_ALREADY_EXIST', 400, 'User with this email already exist.')
      }

      const password =
         userInput.password &&
         userInput.password.trim() &&
         (await bcrypt.hash(userInput.password.trim(), 12))

      const user = await this.user.findOneAndUpdate(
         { _id: id },
         { ...userInput, ...(password && { password }) },
      )

      return user
   }

   generatePassword() {
      return UserService.password()
   }

   async list(options = {}) {
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

         const users = await this.user.find(query, null, {
            // sort: { [sortby]: sortorder },
            skip: offset,
            limit: limit,
         })
         // .populate("profession")
         // .populate("role");

         return users
      } catch (error) {
         throw Error(error)
      }
   }

   async login(email, password) {
      const userRecord = await this.user.findOne({ email })

      if (not(userRecord)) throw new ForbiddenError(401, 'Incorrect email or password.')

      const validPassword =
         password && userRecord.password && (await bcrypt.compare(password, userRecord.password))

      if (not(validPassword)) throw new ForbiddenError(401, 'Incorrect email or password.')

      return {
         user: userRecord,
         access_token: UserService.generateToken(userRecord),
         refresh_token: UserService.generateToken(userRecord, true),
         expires_in: config.accessTokenTtl,
      }
   }

   async facebookAuthentication(profile) {
      const user = await this.user.findOneAndUpdate(
         { 'facebook.id': profile.id },
         { email: profile.emails[0].value, facebook: profile },
         {
            upsert: true,
         },
      )

      return {
         user,
         access_token: UserService.generateToken(user),
      }
   }

   async refreshToken(token) {
      const { iat, exp, ...user } = await jwtVerifyRefreshToken(token)

      return {
         user,
         access_token: UserService.generateToken(user), // TODO: fix for refresh token
         refresh_token: UserService.generateToken(user, true),
         expires_in: config.refreshTokenTtl,
      }
   }

   async listUsersByUserType(query, options = {}) {
      const users = await this.user.find(query)
      return users
   }

   static password() {
      return Math.random().toString(36).substring(2, 15)
   }

   static generateToken(user, refreshtoken = false) {
      if (refreshtoken) {
         return jwt.sign(user.toJSON(), config.secretRefreshToken, {
            expiresIn: `${config.refreshTokenTtl}`,
         })
      }
      return jwt.sign(user.toJSON(), config.secretToken, {
         expiresIn: `${config.accessTokenTtl}h`, // make sure that unit is in h(Hour)
      })
   }

   async deserializeUser(id) {
      const userRecord = await this.user.findOne({ _id: id })

      if (not(userRecord)) throw new Error('User not found')

      return userRecord
   }
}

module.exports = UserService
