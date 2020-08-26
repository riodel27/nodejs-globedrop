const chai = require('chai')
const { Container } = require('typedi')

const { expect } = chai

describe('Users', () => {
   beforeEach(async () => {
      const User = Container.get('userModel')
      await User.deleteMany({})
   })

   describe('Users List', () => {
      it('should return all the users', async () => {
         const UserServiceInstance = Container.get('user.service')

         const response = await UserServiceInstance.list()

         expect(response).to.have.lengthOf(0)
      })
   })

   describe('Create User', () => {
      it('should create user', async () => {
         const UserServiceInstance = Container.get('user.service')

         const response = await UserServiceInstance.createUser({
            email: '234234@gmail.com',
            password: 'yawaka',
         })

         expect(response).to.have.property('email')
      })
   })
})
