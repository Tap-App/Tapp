/***********************
* USERS
***********************/
'use strict'

const Boom = require ('boom')
const Uuid = require ('node-uuid')
const Joi = require('joi')
const Mongojs = require('hapi-mongojs')
const ObjectId = require("mongojs").ObjectId;

exports.register = (server, options, next) => {

  /***********************
  *  ROUTES
  ***********************/
  // returns all users
  server.route({
    method: 'GET',
    path: '/users',

    handler(request, reply) {
      // get db collection
      const userCollection = Mongojs.db().collection('users');
      // execute a query
      userCollection.find((err, data) => {
          if (err) {
              return reply(Boom.wrap(err, 'Internal MongoDB error'))
          }
          reply(data)
      })
    }
  })
  // creates a new user
  server.route({
    method: 'POST',
    path: '/users',
    handler(request, reply) {
      const newUser = {
                        repId : request.payload.repId,
                        username : request.payload.username,
                        name : request.payload.name,
                        password: request.payload.password,
                        distributer: request.payload.distributer
                      }
      const userCollection = Mongojs.db().collection('users');
      if (request.payload.access === 'TappRules') {
        console.log('acces granted');
        userCollection.save(newUser,(err,data) => {
          if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'))
          }

        })
      }
    }
  })

   next()
}





/***********************
* this defines a new Hapi plugin called 'routes-users'
***********************/
exports.register.attributes = {
  name: 'routes-users'
}
