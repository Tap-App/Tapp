/***********************
* Node backed w/ Hapi
***********************/
'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Mongojs = require('mongojs')


const server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 8332
})

// this registers inert with hapi
server.register([
  Inert,
  require('./routes/accounts')], (err) => {
    if (err) { throw err }
  })

/***********************
*  DATABASE
* // the db is on a remote server (the port default to mongo)
* let db = mongojs('example.com/mydb', ['mycollection'])
***********************/
server.app.db = Mongojs('tapp-db', ['accounts', 'users', 'inventory'])

/***********************
*  ROUTES (extracted to separate files)
***********************/

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
