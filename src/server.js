/***********************
* Node backed w/ Hapi
***********************/
'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Mongojs = require('hapi-mongojs')

/***********************
*  DATABASE with mongojs plugin
* // the db is on a remote server (the port default to mongo)
* let db = mongojs('example.com/mydb', ['mycollection'])
* localhost:27017
***********************/
const plugins = [
  {
    register: Mongojs,
    options:{
      url: 'mongodb://heroku_k8513x73:a4v2aule5ka5t5g6ohe0djr6ej@ds115798.mlab.com:15798/heroku_k8513x73',
      collections: [
              {
                name: 'users'
              },
              {
                name: 'accounts'
              },
              {
                name: 'orders'
              },
              {
                name:'inventory'
              }
            ]    }
  }
]

// SERVER:
const server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 8332
})

// this registers inert and route plugins with hapi
server.register([
  Inert,
  require('./routes/accounts'),
  require('./routes/inventory'),
  require('./routes/users'),
  require('./routes/orders')
  ], (err) => {
    if (err) { throw err }
  })


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

server.register(plugins, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }

server.start((err) => {
  if (err) { throw err }

  console.log('Server running at:', server.info.uri)
});
});
