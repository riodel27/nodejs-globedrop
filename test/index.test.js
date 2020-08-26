/* eslint-disable global-require */

const express = require('express')
const { Container } = require('typedi')

const config = require('../src/config')[process.env.NODE_ENV || 'development']

before(async function () {
   const app = await require('../src/loaders').init({ expressApp: express(), config })
   Container.set('app', app)
})

after(async function () {
   process.exit(0)
})
