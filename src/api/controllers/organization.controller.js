const mongoose = require('mongoose')

const { Container } = require('typedi')
const { body, validationResult, param } = require('express-validator')
const { not } = require('ramda')

const { UserInputError, CustomError } = require('../../utils/error')

module.exports = {
   // eslint-disable-next-line consistent-return
   validate: (method) => {
      switch (method) {
         case 'createOrganization': {
            return [body('org_name', 'org_name is required.').notEmpty()]
         }
         case 'deleteOrganization': {
            return [
               param('id', 'Organization ID is required').custom((id) => {
                  if (not(id)) return false

                  if (id === '') return false

                  if (not(mongoose.Types.ObjectId.isValid(id)))
                     throw new Error(`Invalid Organization ID: ${id}`)

                  return true
               }),
            ]
         }
         case 'getOrganizationById': {
            return [
               param('id', 'Organization ID is required').custom((id) => {
                  if (not(id)) return false

                  if (id === '') return false

                  if (not(mongoose.Types.ObjectId.isValid(id)))
                     throw new Error(`Invalid organization ID: ${id}`)

                  return true
               }),
            ]
         }
         case 'updateOrganization': {
            return [
               param('id', 'Organization ID is required').custom((id) => {
                  if (not(id)) return false

                  if (id === '') return false

                  if (not(mongoose.Types.ObjectId.isValid(id)))
                     throw new Error(`Invalid Organization ID: ${id}`)

                  return true
               }),
            ]
         }
         default:
            break
      }
   },
   createOrganization: async (req, res, next) => {
      const logger = Container.get('logger')
      logger.debug('Calling create organization endpoint with body:%o', req.body)

      try {
         const { body: userInput } = req

         const errors = validationResult(req)

         // validation error
         if (not(errors.isEmpty()))
            return next(new UserInputError(422, JSON.stringify(errors.array())))

         const OrganizationServiceInstance = Container.get('organization.service')

         const organization = await OrganizationServiceInstance.createOrganization(userInput)

         logger.info(`${req.method} ${req.originalUrl} ${200}`)

         return res.status(201).json({
            message: 'Organization Inserted',
            data: organization,
         })
      } catch (error) {
         return next(error)
      }
   },
   deleteOrganization: async (req, res, next) => {
      const logger = Container.get('logger')
      logger.debug('Calling delete organization endpoint ')

      try {
         const { id } = req.params
         const errors = validationResult(req)

         if (not(errors.isEmpty())) {
            const error = errors.errors[0]

            if (error.param === 'id')
               return next(new CustomError('INVALID_ORGANIZATION_ID', 422, error.msg))
         }

         const OrganizationServiceInstance = Container.get('organization.service')

         await OrganizationServiceInstance.deleteOrganization({ _id: id })

         logger.info(`${req.method} ${req.originalUrl} ${200}`)
         return res.status(202).json({ message: 'delete successful' })
      } catch (error) {
         return next(error)
      }
   },
   getAdminsByOrganization: async (req, res, next) => {
      const logger = Container.get('logger')
      logger.debug('Calling get admins by organization endpoint ')

      try {
         const OrganizationServiceInstance = Container.get('organization.service')

         const organization = await OrganizationServiceInstance.findAdminsByOrganization(req.query)

         logger.info(`${req.method} ${req.originalUrl} ${200}`)
         return res.status(200).json({ message: 'Ok', data: organization })
      } catch (error) {
         return next(error)
      }
   },
   getOrganizationById: async (req, res, next) => {
      const logger = Container.get('logger')
      logger.debug('Calling get organization by id endpoint ')

      try {
         const { id } = req.params
         const errors = validationResult(req)

         if (not(errors.isEmpty())) {
            const error = errors.errors[0]
            if (error.param === 'id')
               return next(new CustomError('INVALID_ORGANIZATION_ID', 422, error.msg))
         }

         const OrganizationServiceInstance = Container.get('organization.service')

         const organization = await OrganizationServiceInstance.findOneOrganization(
            { _id: id },
            { populate: true },
         )

         if (not(organization))
            return next(new CustomError('ORGANIZATION_NOT_FOUND', 404, 'Organization Not Found'))

         return res.status(200).json({ message: 'Ok', data: organization })
      } catch (error) {
         return next(error)
      }
   },
   getOrganizations: async (req, res, next) => {
      const logger = Container.get('logger')
      logger.debug('Calling get organizations endpoint ')

      try {
         const OrganizationServiceInstance = Container.get('organization.service')

         const organizations = await OrganizationServiceInstance.list(req.query)

         logger.info(`${req.method} ${req.originalUrl} ${200}`)
         return res.status(200).json({ message: 'Ok', data: organizations })
      } catch (error) {
         return next(error)
      }
   },
   updateOrganization: async (req, res, next) => {
      const OrganizationServiceInstance = Container.get('organization.service')
      const logger = Container.get('logger')

      logger.debug('Calling update organization endpoint ')

      try {
         const { id } = req.params

         const errors = validationResult(req)

         if (not(errors.isEmpty()))
            return next(new UserInputError(422, JSON.stringify(errors.array())))

         const organization = await OrganizationServiceInstance.updateOrganization(id, req.body)

         logger.info(`${req.method} ${req.originalUrl} ${200}`)

         return res.status(200).json({ message: 'Organization Updated', data: organization })
      } catch (error) {
         return next(error)
      }
   },
}
