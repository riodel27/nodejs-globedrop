/* eslint-disable global-require */

const chai = require('chai')
const express = require('express')

const { Container } = require('typedi')

const { expect } = chai

const config = require('../../src/config')[process.env.NODE_ENV || 'development']

before(async function () {
   await require('../../src/loaders').init({ expressApp: express(), config })
})

describe('Users', function () {
   describe('Users List', function () {
      it('should return all the users', async function () {
         const UserServiceInstance = Container.get('user.service')

         const response = await UserServiceInstance.list()

         expect(response).to.have.lengthOf(0)
      })
   })

   describe('Create User', function () {
      it('should create user', async function () {
         const UserServiceInstance = Container.get('user.service')

         const response = await UserServiceInstance.createUser({
            email: '234234@gmail.com',
            password: 'yawaka',
         })

         expect(response).to.have.property('email')
      })
   })
})
