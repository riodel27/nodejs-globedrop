const chai = require('chai')
const request = require('supertest')
const { Container } = require('typedi')

const { expect } = chai

describe('Users API', () => {
   beforeEach(async () => {
      const User = Container.get('userModel')
      await User.deleteMany({})
   })

   describe('GET /users', () => {
      it('should return all users', async () => {
         const app = Container.get('app')

         const response = await request(app)
            .get('/api/users')
            .set(
               'Authorization',
               `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVHlwZSI6InVzZXIiLCJvcmdhbml6YXRpb25zIjpbXSwiX2lkIjoiNWY0NjFjZGY4ZmRjNjIxMWIxNDE1ZDY5IiwiZW1haWwiOiJkc3NkZnNkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEyJDR0Z1h4UmNISmdVZG1GZWNLL3JBVnU5MjJvMDZLcVZIeTl1UGhwOGQ2SjZCbGU0WnN5U0xHIiwiY3JlYXRlZEF0IjoiMjAyMC0wOC0yNlQwODoyNzoxMS4xNDRaIiwidXBkYXRlZEF0IjoiMjAyMC0wOC0yNlQwODoyNzoxMS4xNDRaIiwiaWF0IjoxNTk4NDMwODcyLCJleHAiOjE1OTg1MTcyNzJ9.uij3mwaMBGk86BwydGctur52U-Riyx_kHTYEwyWfF-E`,
            )
         expect(response.status).to.equal(200)
      })
   })
})
