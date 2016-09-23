/***********************
* Node backed w/ Hapi
***********************/
'use strict'

const Hapi = require('hapi')
const Boom = require ('boom')
const Inert = require('inert')


const server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 8332
})

// this registers inert with hapi
server.register(Inert, () => {})


/***********************
*  ROUTES
***********************/
server.route({
  method: 'GET',
  path: '/accounts',

  handler(request, reply) {
    reply(console.log(' account placeholder'))
  }
})

server.route({
  method: 'GET',
  path: '/inventory',

  handler(request, reply) {
    reply(console.log(' inventory placeholder'))
  }
})

server.route({
  method: 'GET',
  path: '/users',

  handler(request, reply) {
    reply(console.log(' users placeholder'))
  }
})


/***********************
*  INERT
* --- *
* Static serving of files. Web requests are all GET requests, and the
* path is basically saying "anything" here. Retrieve the specified files
* from the public/ directory (where your gulpfile should be outputting
* to) and return them.
***********************/
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: '../public/',
      redirectToSlash: true,
      index: true
    }
  }
})

server.start((err) => {
  if (err) { throw err }

  console.log('Server running at:', server.info.uri)
})
